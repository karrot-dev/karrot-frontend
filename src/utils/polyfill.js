<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import Vue from 'vue'
=======
import { reactive, watch } from 'vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { intlLocale } from '@/locales/index'

// Allows us to use someElement.closest(selector)
import 'element-closest'

const state = reactive({
  locale: 'en',
})

watch(() => state.locale, locale => {
  if (!window.IntlPolyfill) return
  setTimeout(() => intlLocale(locale), 500)
})

export default {
  async init () {
    if (!window.Intl) {
      await import('intl/dist/Intl')
      setTimeout(() => intlLocale('en'), 500)
    }
    if (!window.requestAnimationFrame) {
      await import('raf').then(raf => raf.polyfill())
    }
  },
  setLocale (value) {
    state.locale = value
  },
}
