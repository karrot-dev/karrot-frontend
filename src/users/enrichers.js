import { useStore } from 'vuex'
import { unref } from 'vue'

export function useUserEnricher () {
  const store = useStore()
  return user => store.getters['users/enrich'](unref(user))
}
