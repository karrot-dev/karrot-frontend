import { computed } from 'vue'
import { useStore } from 'vuex'

export function useCurrentUserId () {
  const store = useStore()
  return computed(() => store.getters['auth/userId'])
}
