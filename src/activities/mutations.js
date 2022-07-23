import { useMutation, useQueryClient } from 'vue-query'

import api from './api/activities'
import { withStatus } from '@/utils/queryHelpers'
import { queryKeyActivityIcsToken } from '@/activities/queries'

export function useJoinActivityMutation () {
  return withStatus(useMutation(activityId => api.join(activityId)))
}

export function useLeaveActivityMutation () {
  return withStatus(useMutation(activityId => api.leave(activityId)))
}

export function useICSRefreshTokenMutation () {
  const queryClient = useQueryClient()
  return useMutation(
    () => api.refreshICSAuthToken(),
    {
      onSuccess (token) {
        queryClient.setQueryData(
          queryKeyActivityIcsToken(),
          () => token,
        )
      },
    },
  )
}
