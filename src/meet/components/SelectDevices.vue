<template>
  <div>
    <div class="row items-center">
      <div class="text-h6 q-mb-sm">
        Select device
      </div>
      <QSpace />
      <QToggle
        v-model="videoEnabled"
        icon="videocam"
        size="xl"
      />
      <QToggle
        v-model="audioEnabled"
        icon="fas fa-microphone"
        size="xl"
      />
    </div>
    <div
      class="column"
      style="gap: 12px;"
    >
      <video
        v-if="videoEnabled"
        ref="videoRef"
        class="rounded-borders full-width bg-black"
      />
      <VideoDeviceSelect />
      <AudioDeviceSelect />
    </div>
  </div>
</template>

<script setup>
import { attachToElement } from 'livekit-client'
import { QIcon, QSelect, QToggle, QSpace } from 'quasar'
import { onMounted, ref, toRef, watch } from 'vue'

import {
  useAudioMediaStreamVolume,
  useMediaDeviceService,
} from '@/meet/helpers'

import AudioDeviceSelect from '@/meet/components/AudioDeviceSelect.vue'
import VideoDeviceSelect from '@/meet/components/VideoDeviceSelect.vue'

const videoRef = ref(null)

const {
  enable,

  videoDevices,
  audioDevices,

  videoDeviceId,
  audioDeviceId,

  videoEnabled,
  audioEnabled,

  videoLoading,
  audioLoading,

  videoTrack,
  audioMediaStream,
} = useMediaDeviceService()

const {
  audioVolume,
  audioIsSilent,
} = useAudioMediaStreamVolume(audioMediaStream)

onMounted(() => enable())

watch([videoTrack, videoRef], ([track, element]) => {
  if (!track || !element) return
  attachToElement(track, element)
})

// watchEffect(async (onCleanup) => {
//   if (!videoRef.value || !videoTrack.value) return
//   const track = videoTrack.value
//   const element = videoRef.value
//   if (track) {
//     attachToElement(track, videoRef.value)
//   }
//   onCleanup(() => {
//     if (track !== videoTrack.value && videoTrack.value) {
//       detachTrack(track, element)
//     }
//   })
// })

</script>

<style scoped lang="sass">
video
  aspect-ratio: 4/3
  object-fit: cover
</style>
