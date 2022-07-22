import authUserAPI from './api/authUser'
import { useQuery } from 'vue-query'

export const QUERY_KEY_BASE = 'authuser'
export const queryKeys = {
  authUser: () => [QUERY_KEY_BASE, 'user'],
}

export function useAuthUserQuery () {
  const query = useQuery(
    queryKeys.authUser(),
    () => authUserAPI.get(),
    {
      staleTime: Infinity,
    },
  )
  return {
    ...query,
    user: query.data,
  }
}
