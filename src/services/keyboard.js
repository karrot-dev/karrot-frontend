import Vue from 'vue'
import { Platform, throttle, dom } from 'quasar'
const { ready } = dom

const getSize = () => {
  return document.documentElement.clientHeight + document.documentElement.clientWidth
}

const size = {
  original: null,
  current: null,
}

ready(() => { size.original = getSize() })

const keyboard = new Vue({
  data () {
    return {
      is: {
        open: false,
      },
    }
  },
  created () {
    if (!Platform.is.mobile) return
    ready(() => {
      window.addEventListener('resize', throttle(() => {
        this.is.open = size.original !== getSize()
      }, 100))
    })
  },
})

export default keyboard

export const KeyboardPlugin = {
  install (Vue, options) {
    Vue.prototype.$keyboard = keyboard
  },
}
