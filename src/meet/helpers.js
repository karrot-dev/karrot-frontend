import { useEventListener, useStorage } from '@vueuse/core'
import { Room, RoomEvent, Track } from 'livekit-client'
import { computed, readonly, ref, unref, watch, watchEffect } from 'vue'

import { useConfig } from '@/base/helpers'
import api from '@/meet/api/meet'
import { defineService } from '@/utils/datastore/helpers'
import { camelizeKeys, round2dp, sleep } from '@/utils/utils'

export const useMediaDeviceService = defineService(() => {
  // Whether the whole thing is enabled or not
  const enabled = ref(false)

  function enable () {
    enabled.value = true
  }

  function disable () {
    enabled.value = false
  }

  // Whether we want video and/or audio
  // Saved in local storage
  const videoEnabled = useStorage('video-enabled', true)
  const audioEnabled = useStorage('audio-enabled', true)

  // The stream(s), if audio/video requested together these might be the same
  // const videoMediaStream = ref(null)
  const audioMediaStream = ref(null)

  // The associated MediaStreamTracks
  const videoTrack = ref(null)
  const audioTrack = ref(null)

  // Lists of available devices
  const videoDevices = ref(null)
  const audioDevices = ref(null)

  // The devices we *want* to select
  // If we get a different device, this is updated to reflect that reality
  // Saved in local storage
  const videoDeviceId = useStorage('video-device-id', null)
  const audioDeviceId = useStorage('audio-device-id', null)

  // The devices we actually got
  const actualVideoDeviceId = ref(null)
  const actualAudioDeviceId = ref(null)

  // We consider *loading* state to be when our desired and actual devices are not the same
  const videoLoading = computed(() => videoDeviceId.value !== actualVideoDeviceId.value)
  const audioLoading = computed(() => audioDeviceId.value !== actualAudioDeviceId.value)

  async function refreshDevices () {
    const devices = await navigator.mediaDevices.enumerateDevices()
    videoDevices.value = devices.filter(device => device.kind === 'videoinput')
    audioDevices.value = devices.filter(device => device.kind === 'audioinput')
  }

  /**
   * Keeps up to date with underlying device changes
   */
  useEventListener(navigator.mediaDevices, 'devicechange', refreshDevices)

  /**
   * Main logic for requesting devices
   */
  watchEffect(async () => {
    if (!unref(enabled)) return

    const requestVideo = videoEnabled.value && (!videoDeviceId.value || videoDeviceId.value !== actualVideoDeviceId.value)
    const requestAudio = audioEnabled.value && (!audioDeviceId.value || audioDeviceId.value !== actualAudioDeviceId.value)

    let stopped = false

    if ((requestVideo || !videoEnabled.value) && videoTrack.value) {
      videoTrack.value.stop()
      videoTrack.value = null
      actualVideoDeviceId.value = null
      stopped = true
    }

    if ((requestAudio || !audioEnabled.value) && audioTrack.value) {
      audioTrack.value.stop()
      audioTrack.value = null
      actualAudioDeviceId.value = null
      stopped = true
    }

    if (!requestVideo && !requestAudio) return

    if (stopped) {
      await sleep(300) // seems to help on firefox mobile when switching between cameras...
    }

    let videoConstraints = false

    if (requestVideo) {
      if (videoDeviceId.value) {
        videoConstraints = {
          deviceId: videoDeviceId.value,
        }
      }
      else {
        videoConstraints = {
          ideal: {
            facingMode: 'user',
          },
        }
      }
    }

    let audioConstraints = false

    if (requestAudio) {
      if (audioDeviceId.value) {
        audioConstraints = {
          deviceId: audioDeviceId.value,
        }
      }
      else {
        audioConstraints = {}
      }
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: audioConstraints,
    })

    await refreshDevices()

    const tracks = mediaStream.getTracks()

    if (requestVideo) {
      const track = tracks.find(track => track.kind === 'video')
      const { deviceId } = track.getSettings()
      videoDeviceId.value = deviceId
      actualVideoDeviceId.value = deviceId
      videoTrack.value = track
    }

    if (requestAudio) {
      const track = tracks.find(track => track.kind === 'audio')
      const { deviceId } = track.getSettings()
      audioDeviceId.value = deviceId
      actualAudioDeviceId.value = deviceId
      audioTrack.value = track
      audioMediaStream.value = mediaStream
    }

    // An extra check at the end incase we disabled it whilst waiting for the devices...
    if (!unref(enabled)) {
      reset()
    }
  })

  watch(enabled, value => {
    if (!value) {
      reset()
    }
  })

  /**
   * Cleanup everything...
   */
  function reset () {
    // Most importantly, stop the streams...
    if (videoTrack.value) {
      videoTrack.value.stop()
      videoTrack.value = null
    }
    if (audioTrack.value) {
      audioTrack.value.stop()
      audioTrack.value = null
    }

    // videoMediaStream.value = null
    audioMediaStream.value = null

    actualVideoDeviceId.value = null
    actualAudioDeviceId.value = null

    videoDevices.value = null
    audioDevices.value = null
  }

  return {
    enabled: readonly(enabled),
    enable,
    disable,

    videoDevices,
    audioDevices,

    videoDeviceId,
    audioDeviceId,

    videoEnabled,
    audioEnabled,

    videoLoading,
    audioLoading,

    videoTrack,
    audioTrack,

    audioMediaStream,
  }
})

export function useLivekitEndpoint () {
  return useConfig('meet.livekitEndpoint')
}

/**
 * Manages the creation and cleanup of livekit rooms
 * There is either 1 active room, or none. Never multiple.
 */
export const useRoomService = defineService(() => {
  const active = ref(false)
  const roomSubjectRef = ref(null)
  const room = ref(null)

  const participantsByIdentity = ref({})

  const participants = computed(() => {
    if (!participantsByIdentity.value) return []
    return Object.values(participantsByIdentity.value)
  })

  const livekitEndpoint = useLivekitEndpoint()

  async function joinRoom (roomSubject) {
    if (!livekitEndpoint.value) throw new Error('missing livekit endpoint')
    if (!roomSubject) throw new Error('must provide room subject')

    // TODO: handle changing rooms!
    if (roomSubjectRef.value && roomSubjectRef.value !== roomSubject) throw new Error('already in another room!')

    roomSubjectRef.value = roomSubject
    participantsByIdentity.value = {}
    active.value = true

    const token = await api.getToken(roomSubject)
    const wsURL = livekitEndpoint.value
    const newRoom = new Room({
      // TODO: experiment with different settings here
      adaptiveStream: false,
      dynacast: true,
    })

    /**
     *
     * @param participantInfo
     * @param {Participant} participant
     */
    function syncParticipant (participant) {
      if (!participant) return
      if (!participantsByIdentity.value[participant.identity]) {
        participantsByIdentity.value[participant.identity] = {}
      }
      const participantInfo = participantsByIdentity.value[participant.identity]
      const { identity, isLocal, audioLevel = 0, isSpeaking, connectionQuality } = participant
      function getMediaStreamTrack (kind) {
        const track = participant.getTracks().find(track => track.kind === kind)
        if (!track || track.isMuted || !track.isSubscribed) return
        return track.track?.mediaStream.getTracks().find(t => t.kind === kind)
      }
      const metadata = camelizeKeys(JSON.parse(participant.metadata))
      Object.assign(participantInfo, {
        ...metadata,
        isLocal,
        identity,
        audioLevel,
        isSpeaking,
        connectionQuality,
        videoMediaStreamTrack: getMediaStreamTrack('video') ?? null,
        audioMediaStreamTrack: getMediaStreamTrack('audio') ?? null,
      })
      return participantInfo
    }

    newRoom.on(RoomEvent.Connected, () => {
      syncParticipant(newRoom.localParticipant)
      for (const participant of newRoom.participants.values()) {
        syncParticipant(participant)
      }
    })

    newRoom.on(RoomEvent.Disconnected, () => {
      // TODO: hmm, disconnected is maybe more like leaving the room entirely? or temp disconnection?
      delete participantsByIdentity.value[newRoom.localParticipant.identity]
    })

    newRoom.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      const participantInfo = participantsByIdentity.value[participant.identity]
      if (!participantInfo) return
      participantInfo.connectionQuality = quality
    })

    newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
      delete participantsByIdentity.value[participant.identity]
    })

    newRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
      const speakersMap = {}
      for (const participant of speakers) {
        speakersMap[participant.identity] = participant.audioLevel
      }
      for (const participantInfo of Object.values(participantsByIdentity.value)) {
        const audioLevel = speakersMap[participantInfo.identity]
        if (typeof audioLevel !== 'undefined') {
          Object.assign(participantInfo, {
            isSpeaking: true,
            audioLevel,
          })
        }
        else {
          Object.assign(participantInfo, {
            isSpeaking: false,
            audioLevel: 0,
          })
        }
      }
    })

    newRoom.on(RoomEvent.TrackPublished, (publication, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.TrackUnpublished, (publication, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.TrackMuted, (publication, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.TrackUnmuted, (publication, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.TrackSubscriptionFailed, (trackSid, participant, reason) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.TrackSubscriptionStatusChanged, (publication, status, participant) => {
      syncParticipant(participant)
    })

    newRoom.on(RoomEvent.TrackSubscriptionStatusChanged, (publication, status, participant) => {
      syncParticipant(participant)
    })

    await newRoom.connect(wsURL, token)

    room.value = newRoom // only set when ready and connected
  }

  async function leaveRoom () {
    active.value = false
    await room.value?.disconnect(false)
    room.value = null
    participantsByIdentity.value = {}
    roomSubjectRef.value = null
  }

  const executor = createSerialAsyncExecutor()

  return {
    active: readonly(active),
    roomSubject: readonly(roomSubjectRef),
    joinRoom: executor.wrap(joinRoom),
    leaveRoom: executor.wrap(leaveRoom),
    room,
    participants,
  }
})

/**
 *
 * Give it a room and a track+kind and it'll ensure it is published!
 *
 * @param {Ref<Room>}roomRef
 * @param {Ref<MediaStreamTrack>} trackRef
 * @param kind
 */
export function useTrackPublisher (roomRef, trackRef, kind) {
  watch([roomRef, trackRef], async ([room, /** MediaStreamTrack */ track]) => {
    if (!room) return
    const localParticipant = room.localParticipant

    // First unpublish any existing tracks of this kind
    const tracks = Array.from(localParticipant.tracks.values()).filter(t => t.kind === kind)
    await Promise.all(tracks.map((track) => localParticipant.unpublishTrack(track.track)))

    if (track) {
      // Then, if present, publish our new one
      await localParticipant.publishTrack(track, {

        // TODO: could better get source from the device...
        // this kind is needed to enable the speaker detection...
        source: kind === 'audio' ? Track.Source.Microphone : Track.Source.Camera,
        stream: 'stream-group', // causes to be in same stream group
      })
    }
  }, { immediate: true })
}

/**
 * Processes an audio stream and tells you the volume and whether it is silent
 */
export function useAudioMediaStreamVolume (audioMediaStream) {
  const audioVolume = ref(0)
  const audioIsSilent = ref(false)

  watch(audioMediaStream, /** MediaStream */ stream => {
    audioVolume.value = 0
    audioIsSilent.value = false
    if (!stream || !stream.active) return
    const audioContext = new AudioContext()
    let silentOccurences = 0
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    source.connect(analyser)
    const pcmData = new Float32Array(analyser.fftSize)
    async function processFrame () {
      // If the stream has changed, or gone, tidy up...
      if (audioMediaStream.value !== stream) {
        audioVolume.value = 0
        audioIsSilent.value = false
        await audioContext.close()
        return
      }

      analyser.getFloatTimeDomainData(pcmData)
      let sumSquares = 0.0
      let sound = false
      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude
        if (amplitude > 0) {
          sound = true
        }
      }
      const rms = Math.sqrt(sumSquares / pcmData.length)
      const ARBITARY_SCALING_NUMBER = 10
      // random scaling + max value 1
      const value = Math.min(rms * ARBITARY_SCALING_NUMBER, 1)

      // make it fall slower, and round it to 2dp
      const previousValue = audioVolume.value
      audioVolume.value = round2dp(Math.max(value, previousValue * 0.95))

      if (sound) {
        if (audioIsSilent.value) {
          audioIsSilent.value = false
        }
        silentOccurences = 0
      }
      else if (!audioIsSilent.value) {
        silentOccurences++
        // This prevents detecting silence when switching devices
        if (silentOccurences > 20) {
          audioIsSilent.value = true
        }
      }
      requestAnimationFrame(processFrame)
    }
    requestAnimationFrame(processFrame)
  }, { immediate: true })

  return {
    audioVolume,
    audioIsSilent,
  }
}

/**
 * Use to execute make async functions execute in series
 *
 * You can wrap unrelated functions, such that when they execute, only
 * one executes at a time.
 */
function createSerialAsyncExecutor () {
  let promise

  /**
   * Pass in the unwrapped function, get back a wrapped function!
   *
   * The returned function will work exactly as the original one would have
   * It preserves "this", arguments, and return value
   *
   * It will just wait politely until a previous execution is complete.
   *
   * Errors should be unaffected, although haven't actually tried this out...
   */
  function wrap (fn) {
    return async function () {
      if (promise) {
        try {
          // wait for any previous execution to finish
          await promise
        }
        catch {
          // ignore, not for us...
        }
      }
      try {
        // run our function :)
        promise = fn.apply(this, arguments)
        return await promise
      }
      finally {
        // tidy up...
        promise = null
      }
    }
  }

  return {
    wrap,
  }
}
