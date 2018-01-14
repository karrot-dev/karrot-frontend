import Vue from 'vue'
import locales, { intlLocale } from '@/locales'

export default new Vue({
  data () {
    return {
      locale: 'en',
    }
  },
  watch: {
    locale (locale) {
      if (!window.IntlPolyfill) return
      return intlLocale(locale)
    },
  },
  methods: {
    async init () {
      if (window.Intl) return
      await Promise.all([
        import('intl'),
        locales.en.intlLocale(),
      ])
    },
  },
})
