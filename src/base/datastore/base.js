import persistedState from '@/base/datastore/persistedState'
import router from '@/base/datastore/routerPlugin'
import dependentState from '@/base/datastore/dependentState'

import routeError from '@/base/datastore/routeError'
import routeMeta from '@/base/datastore/routeMeta'

export default {
  modules: {
    routeMeta,
    routeError,
  },
  plugins: [
    persistedState,
    router,
    dependentState,
  ],
}
