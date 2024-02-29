<template>
  <video
    v-if="hasScreenShareVideo"
    ref="videoRef"
    class="fit bg-black"
    style="object-fit: contain;"
  />
</template>

<script setup>
import { attachToElement } from 'livekit-client'
import { computed, ref, toRef, watch } from 'vue'

const videoRef = ref(null)

const props = defineProps({
  participant: {
    type: Object,
    required: true,
  },
})

const participant = toRef(props, 'participant')

const screenShareVideoMediaStreamTrack = computed(() => participant.value?.screenShareVideoMediaStreamTrack)

const hasScreenShareVideo = computed(() => Boolean(screenShareVideoMediaStreamTrack.value))

watch([screenShareVideoMediaStreamTrack, videoRef], ([track, element]) => {
  if (!track || !element) return
  attachToElement(track, element)
})
</script>

<style scoped lang="sass">
</style>
