// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import about, { plugin as aboutPlugin } from '@/utils/datastore/about'
import connectivity from '@/utils/datastore/connectivity'
import presence from '@/utils/datastore/presence'
import refresh from '@/utils/datastore/refresh'
import refreshPlugin from '@/utils/datastore/refreshPlugin'
import pwa, { plugin as pwaPlugin } from '@/utils/datastore/pwa'

export default {
  modules: {
    about,
    connectivity,
    presence,
    refresh,
    pwa,
  },
  plugins: [
    refreshPlugin,
    aboutPlugin,
    pwaPlugin,
  ],
}
