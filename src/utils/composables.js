import { useStore } from 'vuex'
import { useQueryClient } from 'vue-query'
import { socketEvents } from '@/boot/socket'
import { onUnmounted } from 'vue'
import { isArray } from 'lodash'

export function useClearDataOnLogout () {
  const store = useStore()
  const queryClient = useQueryClient()
  store.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      queryClient.clear()
    }
  })
}

export function useSocketEvents () {
  return {
    /**
     * Register for socket events, automatically unsubscribes when component unmounted
     *
     * @param types Array|String
     * @param handler Function
     */
    on (types, handler) {
      if (!isArray(types)) types = [types]
      for (const type of types) {
        socketEvents.on(type, handler)
      }
      onUnmounted(() => {
        for (const type of types) {
          socketEvents.off(type, handler)
        }
      })
    },
  }
}
