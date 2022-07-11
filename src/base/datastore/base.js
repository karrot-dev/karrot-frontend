// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import persistedState from '@/base/datastore/persistedState'
import i18nPlugin from '@/base/datastore/i18nPlugin'
import router from '@/base/datastore/routerPlugin'
import dependentState from '@/base/datastore/dependentState'

import geo from '@/base/datastore/geo'
import i18n from '@/base/datastore/i18n'
import route from '@/base/datastore/route'
import routeError from '@/base/datastore/routeError'
import routeMeta from '@/base/datastore/routeMeta'

export default {
  modules: {
    geo,
    i18n,
    route,
    routeMeta,
    routeError,
  },
  plugins: [
    persistedState,
    i18nPlugin,
    router,
    dependentState,
  ],
}
