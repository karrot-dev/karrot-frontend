import i18n from '@/base/i18n'
import axios from 'axios'
import dateFnsHelper from '@/utils/dateFnsHelper'
import polyfill from '@/utils/polyfill'
import locales, { messages as loadMessages, quasarMessages as loadQuasarMessages } from '@/locales/index'
import Quasar from 'quasar-vue-plugin'
import { debounce } from 'quasar'

export default store => {
  const loadLocale = debounce(async locale => {
    // if we don't support the locale, reset to default
    if (!locales[locale]) {
      store.dispatch('i18n/setLocale', 'en')
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
    if (store.state.i18n.locale !== locale) return

    i18n.locale = locale
    Quasar.i18n.set(quasarMessages)
  }, 100)
  store.watch(state => state.i18n.locale, loadLocale, { immediate: true })
}
