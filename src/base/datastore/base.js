import persistedState from '@/base/datastore/persistedState'
import routeError from '@/base/datastore/routeError'
import routeMeta from '@/base/datastore/routeMeta'
import router from '@/base/datastore/routerPlugin'

export default {
  modules: {
    routeMeta,
    routeError,
  },
  plugins: [
    persistedState,
    router,
  ],
}
