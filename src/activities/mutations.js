import { unref } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'

import { queryKeyActivityIcsToken, queryKeyActivityTypeListAll } from '@/activities/queries'
import { withStatus } from '@/utils/queryHelpers'

import api from './api/activities'
import activitySeriesAPI from './api/activitySeries'
import activityTypeAPI from './api/activityTypes'

export function useJoinActivityMutation () {
  return withStatus(useMutation(activityId => api.join(activityId)))
}

export function useLeaveActivityMutation () {
  return withStatus(useMutation(activityId => api.leave(activityId)))
}

export function useDismissFeedbackMutation () {
  return withStatus(useMutation(activityId => api.dismissFeedback(activityId)))
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
