import { computed, unref } from 'vue'
import { useStore } from 'vuex'

export function useCurrentUserIdRef () {
  const store = useStore()
  return computed(() => store.getters['auth/userId'])
}

export function useStoreUsers () {
  const store = useStore()
  return {
    getUser: id => store.state.users.entries[unref(id)],
    getEnrichedUser: id => store.getters['users/get'](unref(id)),
    getUserRef: id => computed(() => store.getters['users/get'](unref(id))),
    // getUserRef: id => computed(() => store.state.users.entries[unref(id)]),
  }
}
