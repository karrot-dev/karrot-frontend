import { readonly, ref, watch } from 'vue'
import { AppVisibility } from 'quasar'

import { defineService } from '@/utils/datastore/helpers'

export const usePresenceService = defineService(() => {
  const away = ref(false)

  let timer = null
  const resetTimer = () => {
    clearTimeout(timer)
    away.value = false
    timer = setTimeout(() => {
      away.value = true
    }, 30 * 1000) // 30 seconds
  }

  ['load', 'mousemove', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'click']
    .forEach(event => document.addEventListener(event, resetTimer, { passive: true }))

  watch(() => AppVisibility.appVisible, appVisible => {
    // listen on tab & window visibility, mostly works on desktop browsers
    away.value = !appVisible
  })

  return {
    isAway: readonly(away),
  }
})
