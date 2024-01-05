import {
  isLocal,
  trackReferencesObservable,
  setupDeviceSelector,
} from '@livekit/components-core'
import { useEventListener, useStorage } from '@vueuse/core'
import { Room, RoomEvent, Track } from 'livekit-client'
import { computed, reactive, readonly, ref, unref, watch, watchEffect } from 'vue'

import { useConfig } from '@/base/helpers'
import api from '@/meet/api/meet'
import { defineService } from '@/utils/datastore/helpers'
import { camelizeKeys, sleep } from '@/utils/utils'

/**
 * @param {Room} roomRef
 */
export function useRemoteAudioTracks (roomRef) {
  const audioTracksRef = ref([])
  let subscription
  watch(roomRef, room => {
    if (room) {
      subscription = trackReferencesObservable(room, [Track.Source.Unknown, Track.Source.Microphone, Track.Source.ScreenShareAudio], {})
        .subscribe(({ trackReferences, participants }) => {
          console.log('track refs!', trackReferences.length, trackReferences)
          audioTracksRef.value = trackReferences.filter(ref => ref.publication.kind === 'audio' && !isLocal(ref.participant))
        })
    }
    else if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  }, { immediate: true })

  return audioTracksRef
}

/**
 * @param {Room} roomRef
 */
export function useCameraParticipants (roomRef) {
  const participantsRef = ref([])
  watchEffect(onCleanup => {
    const room = roomRef.value
    if (!room) return
    const subscription = trackReferencesObservable(roomRef.value, [Track.Source.Camera], {})
      .subscribe(({ trackReferences, participants }) => {
        participantsRef.value = participants.map(participant => {
          // this is a clone, otherwise vue reactive does not notice the changes to the inner
          // properties
          // TODO: maybe a better way!
          // I did try making the things inside the room reactive, but there are too many things
          return Object.assign(Object.create(Object.getPrototypeOf(participant)), participant)
          // return participant
        })
      })
    onCleanup(() => subscription.unsubscribe())
  })
  return participantsRef
}

/**
 *
 * @param {Ref<Room>} roomRef
 */
export function useRoomParticipants (roomRef) {
  /**
   * @param {Room} room
   */
  function getParticipants (room) {
    if (!room) return []
    return [
      room.localParticipant,
      ...Array.from(room.participants.values()).map(participant => ({ ...participant })),
    ]
  }

  const participants = ref(getParticipants(roomRef.value))

  watch(roomRef, room => {
    if (!room) return

    for (const roomEvent of [
      RoomEvent.ConnectionStateChanged,
      RoomEvent.RoomMetadataChanged,

      RoomEvent.ActiveSpeakersChanged,
      RoomEvent.ConnectionQualityChanged,

      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.ParticipantPermissionsChanged,
      RoomEvent.ParticipantMetadataChanged,

      RoomEvent.TrackMuted,
      RoomEvent.TrackUnmuted,
      RoomEvent.TrackPublished,
      RoomEvent.TrackUnpublished,
      RoomEvent.TrackStreamStateChanged,
      RoomEvent.TrackSubscriptionFailed,
      RoomEvent.TrackSubscriptionPermissionChanged,
      RoomEvent.TrackSubscriptionStatusChanged,

      RoomEvent.LocalTrackPublished,
      RoomEvent.LocalTrackUnpublished,
    ]) {
      // TODO: unsubscribe?
      room.on(roomEvent, (...args) => {
        console.log('event!', roomEvent, ...args)
        participants.value = getParticipants(room)
      })
    }
  }, { immediate: true })

  return participants
}

export function useRoomParticipants2 (roomRef) {
  /**
   * @param Participant
   */
  function mapParticipant (participant) {
    const {
      name,
      sid,
      identity,
    } = participant

    const videoTracks = Array.from(participant.videoTracks.values())
    const videoTrack = videoTracks?.[0]?.track

    const tracks = Array.from(participant.tracks.values()).map(track => {
      const {
        kind,
        trackSid,
      } = track
      return {
        kind,
        trackSid,
        track,
      }
    })
    return {
      name,
      sid,
      identity,
      tracks,
      videoTrack,
    }
  }

  /**
   * @param {Room} room
   */
  function getParticipants (room) {
    if (!room) return []
    console.log('updating room participants!')
    return [
      room.localParticipant,
      ...Array.from(room.participants.values()),
    ].map(mapParticipant)
  }

  const participants = ref([])

  watch(roomRef, room => {
    if (!room) return

    participants.value = getParticipants(roomRef.value)

    for (const roomEvent of [
      RoomEvent.ConnectionStateChanged,
      RoomEvent.RoomMetadataChanged,

      RoomEvent.ActiveSpeakersChanged,
      RoomEvent.ConnectionQualityChanged,

      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.ParticipantPermissionsChanged,
      RoomEvent.ParticipantMetadataChanged,

      RoomEvent.TrackMuted,
      RoomEvent.TrackUnmuted,
      RoomEvent.TrackPublished,
      RoomEvent.TrackUnpublished,
      RoomEvent.TrackStreamStateChanged,
      RoomEvent.TrackSubscriptionFailed,
      RoomEvent.TrackSubscriptionPermissionChanged,
      RoomEvent.TrackSubscriptionStatusChanged,

      RoomEvent.LocalTrackPublished,
      RoomEvent.LocalTrackUnpublished,
    ]) {
      // TODO: unsubscribe?
      room.on(roomEvent, (...args) => {
        participants.value = getParticipants(room)
      })
    }
  }, { immediate: true })

  return participants
}

// export function useMediaDevices ({ kind, requestPermissions = true }) {
//   return useObservableState(createMediaDeviceObserver(kind, null, requestPermissions))
// }

export function useMediaDeviceSelect ({ kind, track }) {
  // TODO: see about using these?
  const room = null
  const {
    activeDeviceObservable,
    setActiveMediaDevice,
  } = setupDeviceSelector(kind, room, track)
  const activeDeviceId = useObservableState(activeDeviceObservable)
  return { activeDeviceId, setActiveMediaDevice }
}

function useObservableState (observable, defaultValue = null) {
  const state = ref(defaultValue)
  watchEffect(async (onCleanup) => {
    const subscription = observable.subscribe(value => {
      state.value = value
    })
    onCleanup(() => subscription.unsubscribe())
  })
  return state
}

export function useAudioMediaStreamVolume (audioMediaStream) {
  const audioVolume = ref(0)
  const audioIsSilent = ref(false)

  watch(audioMediaStream, /** MediaStream */ stream => {
    audioVolume.value = 0
    audioIsSilent.value = false
    if (!stream || !stream.active) return
    // let stop = false
    const audioContext = new AudioContext()
    let silentOccurences = 0
    console.log('init audio stream', stream)
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

function round2dp (num) {
  return Math.round(num * 100) / 100
}

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
    if (!(enabled.value && unref(enabled))) return

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

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: requestVideo ? { deviceId: videoDeviceId.value } : false,
      audio: requestAudio ? { deviceId: audioDeviceId.value } : false,
    })

    await refreshDevices()

    const tracks = mediaStream.getTracks()

    if (requestVideo) {
      const track = tracks.find(track => track.kind === 'video')
      const { deviceId } = track.getSettings()
      videoDeviceId.value = deviceId
      actualVideoDeviceId.value = deviceId
      videoTrack.value = track
      // videoMediaStream.value = mediaStream
    }

    if (requestAudio) {
      const track = tracks.find(track => track.kind === 'audio')
      const { deviceId } = track.getSettings()
      audioDeviceId.value = deviceId
      actualAudioDeviceId.value = deviceId
      audioTrack.value = track
      audioMediaStream.value = mediaStream
    }
  })

  watch(enabled, value => {
    if (!value) {
      console.log('resetting because not enabled')
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

export const useRoomService = defineService(() => {
  const active = ref(false)
  const roomIdRef = ref(null)
  const room = ref(null)
  const roomInfoRef = ref(null)

  const participants = computed(() => {
    if (!roomInfoRef.value) return []
    return Object.values(roomInfoRef.value.participantsByIdentity)
  })

  const livekitEndpoint = useConfig('meet.livekitEndpoint')

  async function joinRoom (roomId) {
    if (!roomId) throw new Error('must provide roomId')

    // TODO: handle changing rooms!
    if (roomIdRef.value && roomIdRef.value !== roomId) throw new Error('already in another room!')

    roomIdRef.value = roomId
    active.value = true

    const token = await api.getToken({ roomId })
    const wsURL = livekitEndpoint.value
    const newRoom = new Room({ adaptiveStream: true })

    // ----------------- wire up sync stuff
    const roomInfo = reactive({
      participantsByIdentity: {},
    })

    /**
     *
     * @param participantInfo
     * @param {Participant} participant
     */
    function syncParticipant (participantInfo, participant) {
      if (!participantInfo || !participant) return
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
      roomInfo.participantsByIdentity[newRoom.localParticipant.identity] = syncParticipant({}, newRoom.localParticipant)
      for (const participant of newRoom.participants.values()) {
        roomInfo.participantsByIdentity[participant.identity] = syncParticipant({}, participant)
      }
    })

    newRoom.on(RoomEvent.Disconnected, () => {
      delete roomInfo.participantsByIdentity[newRoom.localParticipant.identity]
    })

    newRoom.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      const participantInfo = roomInfo.participantsByIdentity[participant.identity]
      if (!participantInfo) return
      participantInfo.connectionQuality = quality
    })

    newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
      if (!roomInfo.participantsByIdentity[participant.identity]) {
        roomInfo.participantsByIdentity[participant.identity] = syncParticipant({}, participant)
      }
    })

    newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
      delete roomInfo.participantsByIdentity[participant.identity]
    })

    newRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
      const speakersMap = {}
      for (const participant of speakers) {
        speakersMap[participant.identity] = participant.audioLevel
      }
      for (const participantInfo of Object.values(roomInfo.participantsByIdentity)) {
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
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.TrackUnpublished, (publication, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.TrackMuted, (publication, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.TrackUnmuted, (publication, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.TrackSubscriptionFailed, (trackSid, participant, reason) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.TrackSubscriptionStatusChanged, (publication, status, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    newRoom.on(RoomEvent.TrackSubscriptionStatusChanged, (publication, status, participant) => {
      syncParticipant(roomInfo.participantsByIdentity[participant.identity], participant)
    })

    // ---------------

    await newRoom.connect(wsURL, token)

    room.value = newRoom // only set when ready and connected
    roomInfoRef.value = roomInfo
  }

  async function leaveRoom () {
    active.value = false
    await room.value?.disconnect(false)
    room.value = null
    roomInfoRef.value = null
    roomIdRef.value = null
  }

  return {
    active: readonly(active),
    roomId: readonly(roomIdRef),
    joinRoom,
    leaveRoom,
    room,
    participants,
  }
})

/**
 *
 * @param {Ref<Room>}roomRef
 * @param {Ref<MediaStreamTrack>} trackRef
 * @param kind
 */
export function useTrackPublisher (roomRef, trackRef, kind) {
  watch([roomRef, trackRef], async ([room, /** MediaStreamTrack */ track]) => {
    console.log('publish?', room, track)
    if (!room) return
    const localParticipant = room.localParticipant

    // First unpublish any existing tracks of this kind
    const tracks = Array.from(localParticipant.tracks.values()).filter(t => t.kind === kind)
    await Promise.all(tracks.map((track) => localParticipant.unpublishTrack(track.track)))

    if (track) {
      // Then, if present, publish our new one
      console.log('publishing', kind, track)
      await localParticipant.publishTrack(track, {

        // TODO: could better get source from the device...
        // this kind is needed to enable the speaker detection...
        source: kind === 'audio' ? Track.Source.Microphone : Track.Source.Camera,
        stream: 'stream-group', // causes to be in same stream group
      })
      console.log('published', kind)
    }
  }, { immediate: true })
}

export function useRemoteAudioTrackAttacher (room) {
  const remoteAudioTracks = useRemoteAudioTracks(room)

  watch(remoteAudioTracks, tracks => {
    console.log('audio tracks updated!', tracks, tracks.length)
    for (const track of tracks) {
      console.log('attaching audio!')
      track.publication.track.attach()
      // TODO: how to unpublish?
    }
  })
}
