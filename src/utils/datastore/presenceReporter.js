import Vue from 'vue'
import store from '@/base/store'

export default new Vue({
  watch: {
    '$q.appVisible' (val) {
      // listen on tab & window visibility, mostly works on desktop browsers
      store.dispatch('presence/toggle/away', !val)
    },
  },
  created () {
    let timer = null
    const setAway = () => store.dispatch('presence/toggle/away', true)
    const resetTimer = () => {
      clearTimeout(timer)
      store.dispatch('presence/toggle/away', false)
      timer = setTimeout(setAway, 30 * 1000) // 30 seconds
    }

    ['load', 'mousemove', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'click']
      .forEach(event => document.addEventListener(event, resetTimer))
  },
})
