import { useStore } from 'vuex'
import { unref } from 'vue'

export function useStoreGroups () {
  const store = useStore()
  return {
    getGroup: id => store.getters['groups/get'](unref(id)),
  }
}
