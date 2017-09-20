import i18n from '@/i18n'

export default store => {
  store.watch(state => state.i18n.locale, async locale => {
    if (locale === 'de') i18n.setLocaleMessage('de', await import('@/locales/locale-de.json'))
    else if (locale === 'eo') i18n.setLocaleMessage('eo', await import('@/locales/locale-eo.json'))
    else if (locale === 'es') i18n.setLocaleMessage('es', await import('@/locales/locale-es.json'))
    else if (locale === 'fr') i18n.setLocaleMessage('fr', await import('@/locales/locale-fr.json'))
    else if (locale === 'it') i18n.setLocaleMessage('it', await import('@/locales/locale-it.json'))
    else if (locale === 'ru') i18n.setLocaleMessage('ru', await import('@/locales/locale-ru.json'))
    else if (locale === 'sv') i18n.setLocaleMessage('sv', await import('@/locales/locale-sv.json'))
    else if (locale === 'zh') i18n.setLocaleMessage('zh', await import('@/locales/locale-zh.json'))
    i18n.locale = locale
  }, {immediate: true})
}

/*

  Meh, hot module reload is not working :/

  It runs the callback fine, and loads the new translations.
  Even i18n.t('some.string') translates fine. But the page does not update.

  Pls fix, will play the piano for you.

if (module.hot) {
  module.hot.accept([
    '@/locales/locale-de.json',
    '@/locales/locale-eo.json',
    '@/locales/locale-es.json',
    '@/locales/locale-fr.json',
    '@/locales/locale-it.json',
    '@/locales/locale-ru.json',
    '@/locales/locale-sv.json',
    '@/locales/locale-zh.json',
  ], () => {
    i18n.setLocaleMessage('de', require('@/locales/locale-de.json'))
    i18n.setLocaleMessage('eo', require('@/locales/locale-eo.json'))
    i18n.setLocaleMessage('es', require('@/locales/locale-es.json'))
    i18n.setLocaleMessage('fr', require('@/locales/locale-fr.json'))
    i18n.setLocaleMessage('it', require('@/locales/locale-it.json'))
    i18n.setLocaleMessage('ru', require('@/locales/locale-ru.json'))
    i18n.setLocaleMessage('sv', require('@/locales/locale-sv.json'))
    i18n.setLocaleMessage('zh', require('@/locales/locale-zh.json'))
  })
}
*/
