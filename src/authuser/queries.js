import { useQuery, useQueryClient } from 'vue-query'
import { useStore } from 'vuex'

import { useSocketEvents } from '@/utils/composables'
import { isValidationError } from '@/utils/datastore/helpers'
import { useWait } from '@/utils/queryHelpers'

import authUserAPI from './api/authUser'

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
    async () => {
      try {
        return await authUserAPI.get()
      }
      catch (error) {
        if (isValidationError(error)) {
          if (error.response.status === 403) {
            // This case is OK, just no user...
            return null
          }
        }
        throw error
      }
    },
    {
      staleTime: Infinity,
    },
  )

  return {
    ...query,
    wait: useWait(query),
    user: query.data,
  }
}

export function useFailedEmailDeliveriesQuery () {
  const query = useQuery(
    queryKeys.failedEmailDeliveries(),
    () => authUserAPI.getFailedEmailDeliveries(),
    {
      placeholderData: () => [],
    },
  )
  return {
    ...query,
    failedEmailDeliveries: query.data,
  }
}
