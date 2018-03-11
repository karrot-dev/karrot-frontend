import i18n from '@/i18n'
import axios from 'axios'
import dateFnsHelper from '@/services/dateFnsHelper'
import polyfill from '@/polyfill'
import { messages } from '@/locales'

export default store => {
  store.watch(state => state.i18n.locale, async locale => {
    i18n.setLocaleMessage(locale, await messages(locale))
    // Prevent race condition when updating locales quickly
    // If the locale changed while loading messages from the server, don't continue
    if (store.state.i18n.locale !== locale) return

    i18n.locale = locale
    dateFnsHelper.locale = locale
    polyfill.locale = locale
    axios.defaults.headers.common['Accept-Language'] = locale
  }, { immediate: true })
}
