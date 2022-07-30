import authUserAPI from './api/authUser'
import { useQuery, useQueryClient } from 'vue-query'
import { useSocketEvents } from '@/utils/composables'

export const QUERY_KEY_BASE = 'authuser'
export const queryKeys = {
  authUser: () => [QUERY_KEY_BASE, 'user'],
}

export function useAuthUserUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on('auth:user', user => {
    queryClient.setQueryData(queryKeys.authUser(), user)
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
