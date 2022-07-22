import api from './api/auth'
import { useMutation, useQueryClient } from 'vue-query'
import { withStatus } from '@/utils/queryHelpers'
import { queryKeys } from '@/authuser/queries'

export function useLoginMutation () {
  const queryClient = useQueryClient()
  return withStatus(useMutation(
    ({ email, password }) => api.login({ email, password }),
    {
      onSuccess (user) {
        // put the user in the query?
        queryClient.setQueryData(queryKeys.authUser(), () => user)
        // then do stuff
        // - set locale for i18n
        //   - or do that in query onSuccess? so whereever it's received it goes there?
        // - accept invite? (are they still existing?)
        // - join group after login
        // - redirect to somewhere else
      },
    },
  ))
}
