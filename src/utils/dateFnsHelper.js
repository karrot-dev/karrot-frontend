import Vue from 'vue'
import distanceInWords from 'date-fns/distance_in_words'
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
    distanceInWordsToNow (date, options = {}) {
      const now = reactiveNow.value
      if (options.disallowFuture && date > now) date = now
      return distanceInWords(now, date, { locale: this.localeData, ...options })
    },
  },
})
