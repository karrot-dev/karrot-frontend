import { readonly, ref } from 'vue'

import { DEFAULT_LOCALE, detectLocale } from '@/base/datastore/i18n'
import { defineService } from '@/utils/datastore/helpers'

export const useI18nService = defineService(() => {
  const locale = ref(detectLocale() || DEFAULT_LOCALE)

  function setLocale (value) {
    // maybe do background save if it's changed for the user...
    locale.value = value
  }

  return {
    locale: readonly(locale),
    setLocale,
  }
})
