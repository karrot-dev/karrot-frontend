import authUserAPI from './api/authUser'
import { useQuery, useQueryClient } from 'vue-query'
import { useSocketEvents } from '@/utils/composables'
import { useStore } from 'vuex'

export const QUERY_KEY_BASE = 'authuser'
export const queryKeys = {
  authUser: () => [QUERY_KEY_BASE, 'user'],
  failedEmailDeliveries: () => [QUERY_KEY_BASE, 'failed-email-deliveries'],
}

export function useSetUser () {
  const queryClient = useQueryClient()
  const store = useStore()
  return user => {
    // Allow legacy vuex stuff to access the user too
    store.commit('auth/setUser', user)
    queryClient.setQueryData(queryKeys.authUser(), () => user)
  }
}

export function useAuthUserUpdater () {
  const { on } = useSocketEvents()
  const setUser = useSetUser()
  on('auth:user', user => {
    setUser(user)
  })
}

export function useAuthUserQuery () {
  const query = useQuery(
    queryKeys.authUser(),
    () => authUserAPI.get(),
    {
      staleTime: Infinity,
      retry: false,
    },
  )
  return {
    ...query,
    user: query.data,
  }
}

// TODO: try it out!
export function useFailedEmailDeliveriesQuery () {
  const query = useQuery(
    queryKeys.failedEmailDeliveries(),
    () => authUserAPI.getFailedEmailDeliveries(),
  )
  return {
    ...query,
    failedEmailDeliveries: query.data,
  }
}
