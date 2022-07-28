import { defineService } from '@/utils/datastore/helpers'
import { useStore } from 'vuex'

export const useToastService = defineService(() => {
  const store = useStore()

  // methods
  function showToast (params) {
    return store.dispatch('toasts/show', params)
  }

  return {
    showToast,
  }
})
