import { computed, watch, onScopeDispose } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQueryClient } from 'vue-query'
import { isArray } from 'lodash'

import { socketEvents } from '@/boot/socket'
import { useStatusService } from '@/status/services'

export function useClearDataOnLogout () {
  const store = useStore()
  const queryClient = useQueryClient()
  store.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      // Clear data for all queries
      queryClient.resetQueries([])
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
      onScopeDispose(() => {
        for (const type of types) {
          socketEvents.off(type, handler)
        }
      })
    },
  }
}

export function useTitleStatus () {
  const store = useStore()
  const { unseenCount } = useStatusService()

  watch(() => [
    store.getters['breadcrumbs/allNames'],
    unseenCount.value,
  ], ([allNames, unseenCount]) => {
    const names = allNames.slice().reverse()
    names.push('Karrot')
    let title = names.join(' · ')

    if (unseenCount > 0) {
      title = `(${unseenCount}) ${title}`
    }

    document.title = title
  })
}

export function useIntegerRouteParam (name) {
  const router = useRouter()
  const route = useRoute()
  return computed({
    get () {
      return route.params[name] && parseInt(route.params[name], 10)
    },
    set (val) {
      router.push({ params: { [name]: val } })
    },
  })
}
