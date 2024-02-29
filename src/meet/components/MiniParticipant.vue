<template>
  <div
    v-if="hasVideo"
    ref="el"
    class="fixed-top-right shadow-3"
    style="width: 120px; height: 120px; z-index: 20000; border-radius: 999999px; overflow: hidden; touch-action: none;"
    :style="left && top ? { left, top, cursor } : { top: '12px', right: '12px', cursor }"
  >
    <video
      ref="videoRef"
      class="fit no-pointer-events"
      style="object-fit: cover;"
    />
  </div>
</template>

<script setup>
import { useEventListener } from '@vueuse/core'
import { attachToElement } from 'livekit-client'
import { computed, ref, watch } from 'vue'

import { useRoomService } from '@/meet/helpers'

const el = ref(null)
const videoRef = ref(null)

const participant = ref(null)

const { participants } = useRoomService()

watch(participants, entries => {
  // Find the first one speaking
  const speakingParticipant = entries.find(participant => participant.isSpeaking)
  if (speakingParticipant) {
    participant.value = speakingParticipant
  }
  else if (!participant.value) {
    // Or if we don't have one just pick the first one
    participant.value = participants.value[0]
  }
}, { immediate: true })

const videoMediaStreamTrack = computed(() => participant.value?.videoMediaStreamTrack)

const hasVideo = computed(() => Boolean(videoMediaStreamTrack.value))

watch([videoMediaStreamTrack, videoRef], ([track, element]) => {
  if (!track || !element) return
  attachToElement(track, element)
})

function getCursorXY (event) {
  const { clientX: x, clientY: y } = event.touches?.[0] ?? event
  return { x, y }
}

const left = ref(null)
const top = ref(null)
const cursor = ref('grab')

function handleDrag (event) {
  // Ignore right-clicks
  if (event.type === 'mousedown' && event.button !== 0) return
  const { x: initialX, y: initialY } = getCursorXY(event)
  const style = getComputedStyle(event.target)
  const elementX = parseInt(style.left)
  const elementY = parseInt(style.top)

  const moveEvent = {
    touchstart: 'touchmove',
    mousedown: 'mousemove',
  }[event.type]

  const endEvent = {
    touchstart: 'touchend',
    mousedown: 'mouseup',
  }[event.type]

  if (!moveEvent || !endEvent) return

  event.preventDefault()
  event.stopPropagation()

  cursor.value = 'grabbing'

  const moveUnlisten = useEventListener(moveEvent, event => {
    event.preventDefault()
    event.stopPropagation()
    const { x, y } = getCursorXY(event)
    const deltaX = x - initialX
    const deltaY = y - initialY
    left.value = `${elementX + deltaX}px`
    top.value = `${elementY + deltaY}px`
  })
  const endUnlisten = useEventListener(endEvent, () => {
    cursor.value = 'grab'
    moveUnlisten()
    endUnlisten()
  })
}

useEventListener(el, 'mousedown', handleDrag)
useEventListener(el, 'touchstart', handleDrag)
</script>

<style scoped lang="sass">

</style>
