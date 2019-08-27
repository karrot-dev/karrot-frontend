import i18n from '@/base/i18n'
import axios from 'axios'
import dateFnsHelper from '@/utils/dateFnsHelper'
import polyfill from '@/utils/polyfill'
import locales, { messages as loadMessages, quasarMessages as loadQuasarMessages } from '@/locales/index'
import { Quasar, debounce } from 'quasar'

export default datastore => {
  const loadLocale = debounce(async locale => {
    // if we don't support the locale, reset to default
    if (!locales[locale]) {
      datastore.dispatch('i18n/setLocale', 'en')
      return
    }

    axios.defaults.headers.common['Accept-Language'] = locale
    document.documentElement.setAttribute('lang', locale)
    dateFnsHelper.locale = locale
    polyfill.locale = locale

    const [messages, { default: quasarMessages }] = await Promise.all([
      loadMessages(locale),
      loadQuasarMessages(locale),
    ])
    i18n.setLocaleMessage(locale, messages)

    // Prevent race condition when updating locales quickly
    // If the locale changed while loading messages from the server, don't continue
    if (datastore.state.i18n.locale !== locale) return

    i18n.locale = locale
    Quasar.lang.set(quasarMessages)
  }, 100)
  datastore.watch(state => state.i18n.locale, loadLocale, { immediate: true })
}
