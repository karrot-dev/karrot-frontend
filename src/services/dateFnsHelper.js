import Vue from 'vue'
import distanceInWords from 'date-fns/distance_in_words'
import { dateFnsLocale } from '@/locales'

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
      const localeData = await dateFnsLocale(locale)
      if (this.locale !== locale) return
      this.localeData = localeData
    },
  },
  methods: {
    distanceInWordsToNow (date, options = {}) {
      if (options.disallowFuture && date > this.now) date = this.now
      return distanceInWords(this.now, date, { locale: this.localeData, ...options })
    },
  },
})
