// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import createPersistedState from 'vuex-persistedstate'
import { debounceAndFlushOnUnload } from '@/utils/utils'

const SAVE_INTERVAL_MS = 5000

export default createPersistedState({
  paths: [
    'i18n.locale',
    'auth.push.intention',
    'auth.push.token',
  ],
  subscriber: store => handler => store.subscribe(debounceAndFlushOnUnload(handler, SAVE_INTERVAL_MS, { maxWait: SAVE_INTERVAL_MS * 2 })),
})
