<template>
  <div>{{dateInWords(date)}}</div>
</template>

<script>
import { mapGetters } from 'vuex'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

const locales = {
  en: require('date-fns/locale/en'),
  zh: require('date-fns/locale/zh_cn'),
  de: require('date-fns/locale/de'),
  fr: require('date-fns/locale/fr'),
  sv: require('date-fns/locale/sv'),
  es: require('date-fns/locale/es'),
  it: require('date-fns/locale/it'),
  eo: require('date-fns/locale/eo'),
  ru: require('date-fns/locale/ru'),
}

export default {
  props: {
    date: { required: true },
  },
  computed: {
    ...mapGetters({
      userLocale: 'i18n/locale',
    }),
    locale () {
      return locales[this.userLocale]
    },
  },
  methods: {
    dateInWords (date) {
      return distanceInWordsToNow(date, { addSuffix: true, locale: this.locale })
    },
  },
}
</script>
