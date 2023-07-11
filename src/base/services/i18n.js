import { debounce, Quasar } from 'quasar'
import { readonly, ref, watch } from 'vue'

import { useAuthService } from '@/authuser/services'
import axios from '@/base/api/axios'
import i18n from '@/base/i18n'
import locales, { messages as loadMessages, quasarMessages as loadQuasarMessages } from '@/locales'
import { defineService } from '@/utils/datastore/helpers'
import dateFnsHelper from '@/utils/dateFnsHelper'
import polyfill from '@/utils/polyfill'
import { detectLocale } from '@/utils/utils'

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
    // Only set if it's changed AND it's not a less specific version of existing value (e.g. en-gb -> en)
    if (value && locale.value !== value && !locale.value.startsWith(value)) {
      setLocale(value)
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
    i18n.setLocaleMessage(value, messages.default || messages)

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
