import { useMutation, useQueryClient } from 'vue-query'

import api from './api/activities'
import activitySeriesAPI from './api/activitySeries'
import { withStatus } from '@/utils/queryHelpers'
import { queryKeyActivityIcsToken } from '@/activities/queries'

export function useJoinActivityMutation (mutationOptions = {}) {
  return withStatus(useMutation(activityId => api.join(activityId), mutationOptions))
}

export function useLeaveActivityMutation (mutationOptions = {}) {
  return withStatus(useMutation(activityId => api.leave(activityId), mutationOptions))
}

export function useDismissFeedbackMutation (mutationOptions = {}) {
  return withStatus(useMutation(activityId => api.dismissFeedback(activityId), mutationOptions))
}

export function useCreateActivityMutation () {
  return withStatus(useMutation(activity => api.create(activity)))
}

export function useSaveActivityMutation () {
  return withStatus(useMutation(activity => api.save(activity)))
}

export function useCreateActivitySeriesMutation () {
  return withStatus(useMutation(activitySeries => activitySeriesAPI.create(activitySeries)))
}

export function useSaveActivitySeriesMutation () {
  return withStatus(useMutation(activitySeries => activitySeriesAPI.save(activitySeries)))
}

export function useDestroyActivitySeriesMutation () {
  return withStatus(useMutation(activitySeriesId => activitySeriesAPI.delete(activitySeriesId)))
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
