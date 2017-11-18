import Vue from 'vue'

export default new Vue({
  data () {
    return {
      locale: 'en',
    }
  },
  watch: {
    locale (locale) {
      if (!window.IntlPolyfill) return
      switch (locale) {
        case 'de': return import('intl/locale-data/jsonp/de')
        case 'en': return import('intl/locale-data/jsonp/en')
        case 'fr': return import('intl/locale-data/jsonp/fr')
        case 'sv': return import('intl/locale-data/jsonp/sv')
        case 'es': return import('intl/locale-data/jsonp/es')
        case 'it': return import('intl/locale-data/jsonp/it')
        case 'eo': return import('intl/locale-data/jsonp/eo')
        case 'ru': return import('intl/locale-data/jsonp/ru')
        case 'zh': return import('intl/locale-data/jsonp/zh')
        case 'cs': return import('intl/locale-data/jsonp/cs')
      }
    },
  },
  methods: {
    async init () {
      if (window.Intl) return
      await Promise.all([
        import('intl'),
        import('intl/locale-data/jsonp/en.js'),
      ])
    },
  },
})
