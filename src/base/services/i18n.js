import { debounce, Quasar } from 'quasar'
import { readonly, ref, watch } from 'vue'

import { useAuthService } from '@/authuser/services'
import axios from '@/base/api/axios'
import i18n from '@/base/i18n'
import locales, { messages as loadMessages, quasarMessages as loadQuasarMessages } from '@/locales'
import { defineService } from '@/utils/datastore/helpers'
import dateFnsHelper from '@/utils/dateFnsHelper'
import polyfill from '@/utils/polyfill'

export const DEFAULT_LOCALE = 'en'

export const useI18nService = defineService(() => {
  const { user } = useAuthService()
  const defaultLocale = detectLocale() || DEFAULT_LOCALE

  // TODO: we used to persist this to localStorage
  const locale = ref(defaultLocale)

  function setLocale (value) {
    locale.value = value
  }

  watch(() => user.value?.language, value => {
    if (value && locale.value !== value) {
      locale.value = value
    }
  }, { immediate: true })

  const loadLocale = debounce(async value => {
    // if we don't support the locale, reset to default
    if (!locales[value]) {
      setLocale(defaultLocale)
      return
    }

    axios.defaults.headers.common['Accept-Language'] = value
    document.documentElement.setAttribute('lang', value)
    dateFnsHelper.setLocale(value)
    polyfill.setLocale(value)

    const [messages, { default: quasarMessages }] = await Promise.all([
      loadMessages(value),
      loadQuasarMessages(value),
    ])
    i18n.setLocaleMessage(value, messages)

    // Prevent race condition when updating locales quickly
    // If the locale changed while loading messages from the server, don't continue
    if (locale.value !== value) return

    i18n.locale = value
    Quasar.lang.set(quasarMessages)
  }, 100)

  watch(locale, loadLocale, { immediate: true })

  return {
    locale: readonly(locale),
    setLocale,
  }
})

export function detectLocale () {
  let requested = []
  if (navigator.languages) {
    navigator.languages.forEach(e => {
      requested.push(e.toLowerCase())
      // detect similar languages with slightly less priority
      if (e.includes('-')) {
        requested.push(e.replace(/-.*$/, '').toLowerCase())
      }
      // alias definitions
      else if (e === 'zh') {
        requested.push('zh-hans', 'zh-hant')
      }
      else if (e === 'zh_TW') {
        requested.push('zh-hant')
      }
      else if (e === 'zh_CN') {
        requested.push('zh-hans')
      }
    })
  }
  else {
    const val =
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      navigator.userLanguage
    if (val) {
      requested = [val.toLowerCase()]
    }
  }
  if (requested) {
    return requested.find(e => locales[e])
  }
}
