import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

let dateLocale

export default {
  distanceInWordsToNow (date) {
    return distanceInWordsToNow(date, { addSuffix: true, locale: dateLocale })
  },

  setLocale (locale) {
    if (locale === 'zh') {
      // https://date-fns.org/v1.29.0/docs/I18n
      locale = 'zh_cn'
    }

    import(`date-fns/locale/${locale}`)
      .then(result => {
        dateLocale = result
      })
      .catch(() => {
        dateLocale = null
      })
  },
}
