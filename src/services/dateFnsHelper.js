import Vue from 'vue'
import distanceInWords from 'date-fns/distance_in_words'

// https://date-fns.org/v1.29.0/docs/I18n
const localeMap = {
  zh: 'zh_tw',
}

export default new Vue({
  data: {
    locale: 'en',
    localeData: null,
    now: new Date(),
  },
  created () {
    setInterval(() => { this.now = new Date() }, 10 * 1000)
  },
  watch: {
    async locale (locale) {
      this.localeData = await import(`date-fns/locale/${localeMap[locale] || locale}`)
    },
  },
  methods: {
    distanceInWordsToNow (date, options = {}) {
      if (options.disallowFuture && date > this.now) date = this.now
      return distanceInWords(this.now, date, { locale: this.localeData, ...options })
    },
  },
})
