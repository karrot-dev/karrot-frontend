<template>
  <div
    class="relative-position room-participant rounded-borders overflow-hidden bg-grey-2"
    :style="{ border: `2px solid ${participant.isSpeaking ? 'green' : 'white'}` }"
    :class="!videoTrack && 'hidden'"
  >
    <ProfilePicture
      :user="user"
      :is-link="false"
      :size="24"
      class="absolute-bottom-left q-ma-sm"
      :title="user.displayName"
    />

    <QIcon
      v-if="participant.isSpeaking"
      name="fas fa-microphone"
      color="white"
      class="absolute-top-left q-ma-sm"
    />

    <div
      class="absolute-bottom-right row q-ma-sm"
      style="gap: 6px;"
    >
      <QIcon
        :name="`fas fa-microphone${audioTrack ? '' : '-slash'}`"
        color="white"
        style="opacity: 0.8"
      />
      <ConnectionQuality
        :connection-quality="participant.connectionQuality"
      />
    </div>

    <div
      v-if="isCurrentUser"
      class="absolute-top-right q-ma-xs q-pa-xs text-caption rounded-borders"
      style="background: #FFFFFFAA"
    >
      It's you!
    </div>
    <video
      ref="videoRef"
      class="block fit"
    />
  </div>
</template>

<script setup>
import { QIcon } from 'quasar'
import { computed, ref, toRef, watchEffect } from 'vue'

import { useIsCurrentUser } from '@/authuser/helpers'
import { useUser } from '@/users/helpers'

import ConnectionQuality from '@/meet/components/ConnectionQuality.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'

const videoRef = ref(null)
const props = defineProps({
  participant: {
    type: Object,
    required: true,
  },
})

const participant = toRef(props, 'participant')
const userId = computed(() => {
  const value = participant.value?.identity.match(/user:([0-9]+)/)?.[1]
  if (!value) return
  return parseInt(value, 10)
})
const user = useUser(userId)
const isCurrentUser = useIsCurrentUser(userId)

const videoTrack = computed(() => {
  if (!videoRef.value || !participant.value) return
  return Array.from(participant.value.videoTracks.values())[0]
})

const audioTrack = computed(() => {
  if (!videoRef.value || !participant.value) return
  return Array.from(participant.value.audioTracks.values())[0]
})

watchEffect(() => {
  if (!videoTrack.value) return
  videoTrack.value.track?.attach(videoRef.value)
})

</script>

<style scoped lang="sass">
.room-participant
  // 4x3 aspect ratio
  width: 175px
  //width: 48%
  //height: 165px
  aspect-ratio: 4/3

  // circle style...
  //width: 180px
  //height: 180px
  //border-radius: 100%

video
  object-fit: cover
</style>
