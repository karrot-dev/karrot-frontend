import { computed } from 'vue'
import { useStore } from 'vuex'

export function useCurrentUserIdRef () {
  const store = useStore()
  return computed(() => store.getters['auth/userId'])
}

export function useUsers () {
  const store = useStore()
  return {
    getUserRef: id => computed(() => store.getters['users/get'](id)),
  }
}
