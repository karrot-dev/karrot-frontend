import Vue from 'vue'
import distanceInWords from 'date-fns/distance_in_words'
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import { dateFnsLocale } from '@/locales/index'
import reactiveNow from '@/utils/reactiveNow'

export default new Vue({
  data: {
    locale: 'en',
    localeData: null,
  },
  watch: {
    async locale (locale) {
      const localeData = await dateFnsLocale(locale)
      if (this.locale !== locale) return
      this.localeData = localeData
    },
  },
  methods: {
    distanceInWordsStrict (dateA, dateB) {
      return distanceInWordsStrict(dateA, dateB, { locale: this.localeData })
    },
    distanceInWordsToNow (date, options = {}) {
      const now = reactiveNow.value
      if (options.future) {
        if (date < now) date = now
      }
      else {
        if (date > now) date = now
      }
      const fn = options.strict ? distanceInWordsStrict : distanceInWords
      return fn(now, date, { locale: this.localeData, ...options })
    },
  },
})
