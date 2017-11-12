import Vue from 'vue'
import distanceInWords from 'date-fns/distance_in_words'

export default new Vue({
  data: {
    locale: 'en',
    locales: {},
    now: new Date(),
  },
  created () {
    setInterval(() => { this.now = new Date() }, 10 * 1000)
  },
  watch: {
    async locale (locale) {
      if (locale === 'zh') locale = 'zh_tw' // https://date-fns.org/v1.29.0/docs/I18n
      Vue.set(this.locales, locale, await import(`date-fns/locale/${locale}`))
    },
  },
  methods: {
    distanceInWordsToNow (date, options = {}) {
      if (options.disallowFuture && date > this.now) date = this.now
      return distanceInWords(this.now, date, { locale: this.locales[this.locale], ...options })
    },
  },
})
