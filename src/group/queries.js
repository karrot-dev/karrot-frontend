import { useStore } from 'vuex'
import { computed } from 'vue'

export function useCurrentGroupIdRef () {
  const store = useStore()
  return computed(() => store.getters['currentGroup/id'])
}
