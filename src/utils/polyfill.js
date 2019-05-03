import Vue from 'vue'
import { intlLocale } from '@/locales/index'

// Allows us to use someElement.closest(selector)
import 'element-closest'

export default new Vue({
  data () {
    return {
      locale: 'en',
    }
  },
  watch: {
    locale (locale) {
      if (!window.IntlPolyfill) return
      setTimeout(() => intlLocale(locale), 500)
    },
  },
  methods: {
    async init () {
      if (!window.Intl) {
        await import('intl/dist/Intl')
        setTimeout(() => intlLocale('en'), 500)
      }
      if (!window.requestAnimationFrame) {
        await import('raf').then(raf => raf.polyfill())
      }
    },
  },
})
