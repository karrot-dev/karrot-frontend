import Vue from 'vue'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

export default new Vue({
  data: {
    locale: 'en',
    locales: {},
  },
  watch: {
    async locale (locale) {
      if (locale === 'zh') locale = 'zh_cn' // https://date-fns.org/v1.29.0/docs/I18n
      Vue.set(this.locales, locale, await import(`date-fns/locale/${locale}`))
    },
  },
  methods: {
    distanceInWordsToNow (date) {
      return distanceInWordsToNow(date, { addSuffix: true, locale: this.locales[this.locale] })
    },
  },
})
