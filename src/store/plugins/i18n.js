import i18n from '@/i18n'
import { isObject, camelize } from '@/services/utils'

// Hotfix to use existing files
// e.g. converts translations containing {{store_name}} into {storeName}
// TODO: convert files and sync them with transifex
function angularToVueI18n (val) {
  if (isObject(val)) {
    let newVal = {}
    for (const key of Object.keys(val)) {
      newVal[key] = angularToVueI18n(val[key])
    }
    return newVal
  }
  else {
    return val.replace(/{{(.*?)}}/g, (_, a) => `{${camelize(a)}}`)
  }
}

export default store => {
  store.watch(state => state.i18n.locale, async locale => {
    if (['de', 'eo', 'es', 'fr', 'it', 'ru', 'sv', 'zh'].includes(locale)) {
      const messages = angularToVueI18n(await import(`@/locales/locale-${locale}.json`))
      i18n.setLocaleMessage(locale, messages)
    }
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
