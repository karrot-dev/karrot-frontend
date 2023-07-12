import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { unref } from 'vue'

import { queryKeyActivityIcsToken, queryKeyActivityTypeListAll } from '@/activities/queries'
import { withStatus } from '@/utils/queryHelpers'

import api from './api/activities'
import activitySeriesAPI from './api/activitySeries'
import activityTypeAPI from './api/activityTypes'

export function useJoinActivityMutation () {
  return withStatus(useMutation(({ activityId, participantTypeId }) => api.join({ activityId, participantTypeId })))
}

export function useLeaveActivityMutation () {
  return withStatus(useMutation(activityId => api.leave(activityId)))
}

export function useDismissFeedbackMutation () {
  return withStatus(useMutation(activityId => api.dismissFeedback(activityId)))
}

export function useCreateActivityMutation (params) {
  return withStatus(useMutation(activity => api.create(activity), params))
}

export function useSaveActivityMutation (params) {
  return withStatus(useMutation(activity => api.save(activity), params))
}

export function useCreateActivitySeriesMutation (params) {
  return withStatus(useMutation(activitySeries => activitySeriesAPI.create(activitySeries), params))
}

export function useSaveActivitySeriesMutation (params) {
  return withStatus(useMutation(activitySeries => activitySeriesAPI.save(activitySeries), params))
}

export function useDestroyActivitySeriesMutation (params) {
  return withStatus(useMutation(activitySeriesId => activitySeriesAPI.delete(activitySeriesId), params))
}

export function useCreateActivityTypeMutation ({ groupId }) {
  const queryClient = useQueryClient()
  return withStatus(useMutation(
    activityType => activityTypeAPI.create({ ...activityType, group: unref(groupId) }),
    {
      onSuccess () {
        // TODO: invalidate query or wait for websocket? both?
        queryClient.invalidateQueries(queryKeyActivityTypeListAll())
      },
    },
  ))
}

export function useSaveActivityTypeMutation () {
  const queryClient = useQueryClient()
  return withStatus(useMutation(
    activityType => activityTypeAPI.save(activityType),
    {
      onSuccess () {
        // TODO: invalidate query or wait for websocket? both?
        queryClient.invalidateQueries(queryKeyActivityTypeListAll())
      },
    },
  ))
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
