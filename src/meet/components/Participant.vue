<template>
  <div
    class="relative-position room-participant rounded-borders overflow-hidden bg-black"
  >
    <div
      v-if="isLocal"
      class="absolute-top-left q-pa-xs text-caption"
      style="background: #FFFFFF88; border-bottom-right-radius: 4px;"
    >
      It's you!
    </div>

    <template v-if="hasVideo">
      <QIcon
        v-if="hasAudio"
        name="fas fa-microphone"
        class="absolute-top-right q-ma-sm"
        color="white"
        :style="{
          opacity: participant.isSpeaking ? 1 : 0,
          transitionProperty: 'opacity',
          transitionDuration: '0.3s',
        }"
      />
      <QIcon
        v-else
        name="fas fa-microphone-slash"
        class="absolute-top-right q-ma-sm"
        color="white"
        :style="{ opacity: 0.8 }"
      />
    </template>

    <div
      class="absolute-bottom row no-wrap items-center q-pa-sm"
      style="background: #00000055; gap: 4px;"
    >
      <template v-if="user">
        <ProfilePicture
          v-if="user"
          :user="user"
          :is-link="false"
          :size="24"
          class="col-auto"
          :title="user.displayName"
        />
        <div class="text-white text-caption ellipsis">
          {{ user.displayName }}
        </div>
      </template>

      <QSpace />

      <ConnectionQuality
        v-if="participant.connectionQuality !== 'excellent'"
        class="col-auto"
        :connection-quality="participant.connectionQuality"
      />
    </div>

    <QIcon
      v-if="!hasVideo && hasAudio"
      name="fas fa-microphone"
      color="white"
      :style="{
        opacity: participant.isSpeaking ? 1 : 0.5,
        transitionProperty: 'opacity',
        transitionDuration: '0.3s',
      }"
      size="lg"
      class="absolute-full full-width full-height"
    />
    <QIcon
      v-else-if="!hasVideo"
      name="videocam_off"
      color="grey-5"
      size="lg"
      class="absolute-full full-width full-height"
    />

    <video
      v-if="hasVideo"
      ref="videoRef"
      class="block fit"
    />
    <audio
      ref="audioRef"
      class="hidden"
    />
  </div>
</template>

<script setup>
import { attachToElement } from 'livekit-client'
import { QIcon, QSpace } from 'quasar'
import { computed, ref, toRef, watch, watchEffect } from 'vue'

import { useIsCurrentUser } from '@/authuser/helpers'
import { useUser } from '@/users/helpers'

import ConnectionQuality from '@/meet/components/ConnectionQuality.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'

const videoRef = ref(null)
const audioRef = ref(null)

const props = defineProps({
  participant: {
    type: Object,
    required: true,
  },
})

const participant = toRef(props, 'participant')
const userId = computed(() => participant.value?.userId)
const user = useUser(userId)
const isCurrentUser = useIsCurrentUser(userId)

// const videoTrack = computed(() => {
//   if (!videoRef.value || !participant.value) return
//   return Array.from(participant.value.videoTracks.values())[0]
// })
//
// const audioTrack = computed(() => {
//   if (!videoRef.value || !participant.value) return
//   return Array.from(participant.value.audioTracks.values())[0]
// })

// watchEffect(() => {
//   if (!videoTrack.value) return
//   // videoTrack.value.track?.attach(videoRef.value)
//   attachToElement(participant.value.videoMediaStreamTrack, videoRef.value)
// })

const videoMediaStreamTrack = computed(() => participant.value?.videoMediaStreamTrack)
const audioMediaStreamTrack = computed(() => participant.value?.audioMediaStreamTrack)

const hasVideo = computed(() => Boolean(videoMediaStreamTrack.value))
const hasAudio = computed(() => Boolean(audioMediaStreamTrack.value))

const isLocal = computed(() => participant.value?.isLocal)

watch([videoMediaStreamTrack, videoRef], ([track, element]) => {
  if (!track || !element) return
  attachToElement(track, element)
})

watch([isLocal, audioMediaStreamTrack, audioRef], ([isLocal, track, element]) => {
  if (!track || !element) return
  if (isLocal) return
  // TODO: the recycled element trick for safari... see livekit code
  attachToElement(track, element)
})

</script>

<style scoped lang="sass">
.room-participant
  aspect-ratio: 4/3
  //max-height: 100%
  //margin: 0 auto

video
  object-fit: cover
</style>
