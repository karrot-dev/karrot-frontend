import createPersistedState from 'vuex-persistedstate'
import { debounceAndFlushBeforeUnload } from '@/utils/utils'

export default createPersistedState({
  paths: [
    'i18n.locale',
    'auth.push.intention',
    'auth.push.token',
  ],
  subscriber: store => handler => store.subscribe(debounceAndFlushBeforeUnload(handler, 5000)),
})
