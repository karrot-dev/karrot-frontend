import Vue from 'vue'
import distanceInWords from 'date-fns/distance_in_words'

function importLocale (locale) {
  switch (locale) {
    case 'de': return import('date-fns/locale/de')
    case 'en': return import('date-fns/locale/en')
    case 'fr': return import('date-fns/locale/fr')
    case 'sv': return import('date-fns/locale/sv')
    case 'es': return import('date-fns/locale/es')
    case 'it': return import('date-fns/locale/it')
    case 'eo': return import('date-fns/locale/eo')
    case 'ru': return import('date-fns/locale/ru')
    case 'zh': return import('date-fns/locale/zh_tw')
    case 'cs': return import('date-fns/locale/cs')
  }
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
      this.localeData = await importLocale(locale)
    },
  },
  methods: {
    distanceInWordsToNow (date, options = {}) {
      if (options.disallowFuture && date > this.now) date = this.now
      return distanceInWords(this.now, date, { locale: this.localeData, ...options })
    },
  },
})
