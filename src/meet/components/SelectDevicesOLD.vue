<template>
  <h2>select devices</h2>

  <div
    style="max-width: 400px; border: 1px solid lightgrey;"
    class="q-pa-md bg-white rounded-borders q-mx-auto"
  >
    <div class="text-h6 q-mb-sm">
      Select device
    </div>
    <QBtn
      unelevated
      outline
      label="Request permissions"
      @click="requestPermissions"
    />
    <div
      class="column"
      style="gap: 12px;"
    >
      <video
        ref="videoRef"
        class="rounded-borders full-width"
      />
      <QSelect
        v-if="videoEnabled && videoDevices"
        v-model="videoDeviceId"
        label="Video"
        outlined
        :loading="videoDeviceId !== actualVideoDeviceId"
        emit-value
        map-options
        class="bg-white"
        autocomplete="false"
        :options="videoDevices.map(device => ({
          value: device.deviceId,
          label: device.label,
        }))"
      />
      <QSelect
        v-if="audioEnabled && audioDevices"
        v-model="audioDeviceId"
        label="Audio"
        outlined
        :loading="audioDeviceId !== actualAudioDeviceId"
        emit-value
        map-options
        class="bg-white"
        autocomplete="false"
        :error="audioDeviceId === actualAudioDeviceId && silent"
        error-message="No sound detected"
        :options="audioDevices.map(device => ({
          value: device.deviceId,
          label: device.label,
        }))"
      >
        <template #prepend>
          <div
            style="width: 5px; top: 12px; bottom: 12px;"
            class="bg-grey-2 absolute"
          >
            <div
              :style="{ height: `${volume * 100}%` }"
              class="absolute-bottom bg-green-4 full-width"
            />
          </div>
        </template>
      </QSelect>
    </div>
  </div>
  <pre>silent: {{ silent }}</pre>
  <pre>videoDeviceId: {{ videoDeviceId }}</pre>
  <pre>actualVideoDeviceId: {{ actualVideoDeviceId }}</pre>

  <pre>audioDeviceId: {{ audioDeviceId }}</pre>
  <pre>actualAudioDeviceId: {{ actualAudioDeviceId }}</pre>

  <pre>videoDevice: {{ videoDevice }}</pre>
  <pre>audioDevice: {{ audioDevice }}</pre>
  <pre>audioDevices: {{ audioDevices }}</pre>
  <pre>videoDevices: {{ videoDevices }}</pre>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import {
  createLocalAudioTrack,
  createLocalTracks,
  createLocalVideoTrack,
  LocalAudioTrack,
  Room,
  Track,
  attachToElement,
  detachTrack,
} from 'livekit-client'
import { QBtn, QIcon, QSelect } from 'quasar'
import { computed, onMounted, ref, toRefs, watchEffect } from 'vue'

import { useMediaDevices, useMediaDeviceSelect } from '@/meet/helpers'
import { sleep } from '@/utils/utils'

const props = defineProps({
  videoEnabled: {
    type: Boolean,
    default: true,
  },
  audioEnabled: {
    type: Boolean,
    default: true,
  },
})

const {
  videoEnabled,
  audioEnabled,
} = toRefs(props)

const videoRef = ref(null)

const mediaStream = ref(null)
const audioTrack = ref(null)
const videoTrack = ref(null)

// TODO: requestPermissions still asks...
// TODO: *think* I might need to use Room.getLocalDevices myself... some clash happening somewhere I think, with when I ask for tracks later? not sure...
// const videoDevices = useMediaDevices({ kind: 'videoinput', requestPermissions: true })
// const audioDevices = useMediaDevices({ kind: 'audioinput', requestPermissions: true })

const videoDevices = ref(null)
const audioDevices = ref(null)

async function requestPermissions () {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: videoEnabled.value,
    audio: audioEnabled.value,
  })
  const devices = await navigator.mediaDevices.enumerateDevices()
  videoDevices.value = devices.filter(device => device.kind === 'videoinput')
  audioDevices.value = devices.filter(device => device.kind === 'audioinput')
  console.log('loaded devices!', devices)
  console.log('loaded stream', stream)
  console.log('with tracks', stream.getTracks())
  const tracks = stream.getTracks()

  mediaStream.value = stream

  if (videoEnabled.value) {
    const track = tracks.find(track => track.kind === 'video')
    console.log('video track!', track)
    const { deviceId } = track.getSettings()
    videoDeviceId.value = deviceId
    actualVideoDeviceId.value = deviceId
    videoTrack.value = track
  }
  else {
    videoDeviceId.value = null
    actualVideoDeviceId.value = null
    videoTrack.value = null
  }

  if (audioEnabled.value) {
    const track = tracks.find(track => track.kind === 'audio')
    console.log('audio track!', track)
    const { deviceId } = track.getSettings()
    audioDeviceId.value = deviceId
    actualAudioDeviceId.value = deviceId
    audioTrack.value = track
  }
  else {
    audioDeviceId.value = null
    actualAudioDeviceId.value = null
    audioTrack.value = null
  }

  // stream.getTracks().forEach((track) => {
  //   console.log('got track', track)
  //   // const { deviceId } = track.getSettings()
  //
  //   console.log('  capabilities', track.getCapabilities?.())
  //   console.log('  settings', track.getSettings?.())
  //   // track.stop()
  // })

  // const devices = await navigator.mediaDevices.enumerateDevices()
}

// watchEffect(async () => {
//   await foo()
// })

// TODO: remember the values, and store them
// TODO: handle defaults? 'default' is used in other code

// not sure this is actually working
const videoDeviceId = ref(null) // useStorage('video-device-id', null)
const audioDeviceId = ref(null) // useStorage('audio-device-id', null)

const actualVideoDeviceId = ref(null)
const actualAudioDeviceId = ref(null)

// const audioDeviceId = ref(null)
// const videoDeviceId = ref(null)

const videoDevice = computed(() => videoDevices.value?.filter(device => device.deviceId === videoDeviceId.value))
const audioDevice = computed(() => audioDevices.value?.filter(device => device.deviceId === audioDeviceId.value))

watchEffect(async () => {
  // console.log('vid', videoDeviceId.value, videoTrack.value?.mediaStreamTrack?.label)
  await requestPermissions()
})

watchEffect(async () => {
  return
  if (!videoDevices.value || !audioDevices.value) return
  // console.log('get user media')
  // await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  // console.log('got user media')
  // console.log('createLocalTracks!')
  // Need to decide whether to create video, audio, or both

  // TODO: pick a default if not already selected

  let createVideoTrack = videoEnabled.value && videoDeviceId.value !== actualVideoDeviceId.value
  let createAudioTrack = audioEnabled.value && audioDeviceId.value !== actualAudioDeviceId.value

  if (createVideoTrack) {
    if (!videoDevices.value.some(device => device.deviceId === videoDeviceId.value)) {
      console.log('video device not available!')
      createVideoTrack = false
      videoDeviceId.value = null
    }
  }

  if (createAudioTrack) {
    if (!audioDevices.value.some(device => device.deviceId === audioDeviceId.value)) {
      console.log('audio device not available!')
      createAudioTrack = false
      audioDeviceId.value = null
    }
  }

  // nowt to do
  if (!createAudioTrack && !createVideoTrack) return

  try {
    let stopped = false
    if (createVideoTrack && videoTrack.value) {
      videoTrack.value.stop()
      stopped = true
    }

    if (createAudioTrack && audioTrack.value) {
      audioTrack.value.stop()
      stopped = true
    }
    if (stopped) {
      await sleep(300)
    }

    console.log('CREATING LOCAL TRACKS', { createVideoTrack, createAudioTrack, videoDeviceId: videoDeviceId.value, audioDeviceId: audioDeviceId.value })

    // console.log('use media device promises...', DeviceManager.userMediaPromiseMap.size)

    const tracks = await createLocalTracks({
      video: createVideoTrack
        ? {
            deviceId: videoDeviceId.value,
          }
        : false,
      audio: createAudioTrack
        ? {
            deviceId: audioDeviceId.value,
          }
        : false,
    })
    // console.log('got local tracks')
    if (createVideoTrack) {
      const newVideoTrack = tracks.find(track => track.kind === Track.Kind.Video)
      console.log('created video track', newVideoTrack)
      if (newVideoTrack) {
        // cleanup old video track
        videoTrack.value?.stop()
        // await newVideoTrack.setProcessor(BackgroundBlur(10))
        const deviceId = await newVideoTrack.getDeviceId()
        videoTrack.value = newVideoTrack
        // We update both, as the user might have selected a different entry in the prompt
        videoDeviceId.value = deviceId
        actualVideoDeviceId.value = deviceId
      }
    }
    if (createAudioTrack) {
      const newAudioTrack = tracks.find(track => track.kind === Track.Kind.Audio)
      console.log('created audio track', newAudioTrack)
      if (newAudioTrack) {
        const deviceId = await newAudioTrack.getDeviceId()
        // We update both, as the user might have selected a different entry in the prompt
        audioTrack.value = newAudioTrack
        audioDeviceId.value = deviceId
        actualAudioDeviceId.value = deviceId
      }
    }
    // console.log('finished updated tracking')
  }
  catch (error) {
    console.error('error making tracks!', error)

    // Try and cleanup
    videoTrack.value?.stop()
    videoDeviceId.value = null
    actualVideoDeviceId.value = null

    audioTrack.value?.stop()
    audioDeviceId.value = null
    actualAudioDeviceId.value = null

    await sleep(300)

    // Reset the
    // if (videoTrack.value) {
    //   const deviceId = await videoTrack.value.getDeviceId()
    //   videoDeviceId.value = deviceId
    //   actualVideoDeviceId.value = deviceId
    // }
    //
    // if (audioTrack.value) {
    //   const deviceId = await audioTrack.value.getDeviceId()
    //   audioDeviceId.value = deviceId
    //   actualAudioDeviceId.value = deviceId
    // }

    throw error
  }
})

watchEffect(async (onCleanup) => {
  if (!videoRef.value || !videoTrack.value) return
  if (videoTrack.value) {
    // videoTrack.value.attach(videoRef.value)
    attachToElement(videoTrack.value, videoRef.value)
  }
  // console.log('attached')
  onCleanup(() => detachTrack(videoTrack.value))
})

const volume = ref(0)
const silent = ref(false)

watchEffect(onCleanup => {
  if (!audioTrack.value) return
  const audioContext = new AudioContext()
  // console.log('setting up analayzer', audioTrack.value)
  silent.value = false
  // Might need .mediaStream, if it's a livekit track object... or something
  // const mediaStream = audioTrack.value
  // console.log('media stream?', mediaStream)
  // return
  const source = audioContext.createMediaStreamSource(mediaStream.value)
  const analyser = audioContext.createAnalyser()
  source.connect(analyser)
  let stop = false
  let silentOccurences = 0
  const pcmData = new Float32Array(analyser.fftSize)
  function processFrame () {
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
    // const prevRms = volume.value
    // this makes it fall slower
    // const value = Math.max(rms, prevRms * 0.95)
    // random scaling, max value 1
    const value = Math.min(rms * 5, 1)
    // random scaling, max value 1
    const previousValue = volume.value
    // make it fall slower
    volume.value = Math.max(value, previousValue * 0.95)
    // silent.value = !sound

    if (sound) {
      silent.value = false
      silentOccurences = 0
    }
    else if (!silent.value) {
      silentOccurences++
      // This prevents detecting silence when switching devices
      if (silentOccurences > 10) {
        silent.value = true
      }
    }
    if (!stop) {
      requestAnimationFrame(processFrame)
    }
  }
  requestAnimationFrame(processFrame)

  onCleanup(() => {
    // TODO: is this suitable cleanup?
    audioContext.close()
    stop = true
    volume.value = 0
  })
})

onMounted(() => {
  // const myMeterElement = document.getElementById('my-peak-meter')
  // const myAudio = document.getElementById('my-audio')
  // const audioCtx = new window.AudioContext()
  // const sourceNode = audioCtx.createMediaElementSource(audioRef.value)
  // sourceNode.connect(audioCtx.destination)
  // const meter = new WebAudioPeakMeter(sourceNode, meterRef.value)
  // audioRef.value.addEventListener('play', function () {
  //   audioCtx.resume()
  // })
})

</script>

<style scoped lang="sass">
video
  aspect-ratio: 4/3
  object-fit: cover
</style>
