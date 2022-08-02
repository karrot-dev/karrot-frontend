import { useMutation, useQueryClient } from 'vue-query'

import api from './api/activities'
import { withStatus } from '@/utils/queryHelpers'
import { queryKeyActivityIcsToken } from '@/activities/queries'
import activityAPI from '@/activities/api/activities'

export function useJoinActivityMutation (mutationOptions = {}) {
  return withStatus(useMutation(activityId => api.join(activityId), mutationOptions))
}

export function useLeaveActivityMutation (mutationOptions = {}) {
  return withStatus(useMutation(activityId => api.leave(activityId), mutationOptions))
}

export function useDismissFeedbackMutation (mutationOptions = {}) {
  return withStatus(useMutation(activityId => activityAPI.dismissFeedback(activityId), mutationOptions))
}

export function useICSRefreshTokenMutation (mutationOptions = {}) {
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
      ...mutationOptions,
    },
  )
}
