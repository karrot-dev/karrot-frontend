import createPersistedState from 'vuex-persistedstate'
import { throttle } from 'quasar'

export default createPersistedState({
  paths: [
    'i18n.locale',
    'auth.push.intention',
    'auth.push.token',
  ],
  subscriber: store => handler => store.subscribe(throttle(handler, 5000)),
})
