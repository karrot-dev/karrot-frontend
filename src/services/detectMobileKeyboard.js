import Vue from 'vue'
import { Platform, throttle, dom } from 'quasar'
const { ready, height, width } = dom

const getSize = () => height(window) + width(window)

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
        // if the window is >150px smaller than original, we guess it's the keyboard...
        this.is.open = (size.original - getSize()) > 150
      }, 100))
    })
  },
})

export default keyboard

export const DetectMobileKeyboardPlugin = {
  install (Vue, options) {
    Vue.prototype.$keyboard = keyboard
  },
}
