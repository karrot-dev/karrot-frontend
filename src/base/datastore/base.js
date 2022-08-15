import persistedState from '@/base/datastore/persistedState'
import i18nPlugin from '@/base/datastore/i18nPlugin'
import router from '@/base/datastore/routerPlugin'
import dependentState from '@/base/datastore/dependentState'

import i18n from '@/base/datastore/i18n'
import routeError from '@/base/datastore/routeError'
import routeMeta from '@/base/datastore/routeMeta'

export default {
  modules: {
    i18n,
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
