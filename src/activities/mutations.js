import { unref } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'

import api from './api/activities'
import activitySeriesAPI from './api/activitySeries'
import activityTypeAPI from './api/activityTypes'

import { withStatus } from '@/utils/queryHelpers'
import { queryKeyActivityIcsToken, queryKeyActivityTypeList } from '@/activities/queries'

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

export function useCreateActivityTypeMutation ({ groupId }) {
  const queryClient = useQueryClient()
  return withStatus(useMutation(
    activityType => activityTypeAPI.create({ ...activityType, group: unref(groupId) }),
    {
      onSuccess () {
        // TODO: invalidate query or wait for websocket? both?
        queryClient.invalidateQueries(queryKeyActivityTypeList())
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
        queryClient.invalidateQueries(queryKeyActivityTypeList())
      },
    },
  ))
}

/*
async save ({ commit, dispatch }, activityType) {
  const data = await activityTypes.save(activityType)
  commit('update', [data])
  dispatch('toasts/show', {
    message: 'NOTIFICATIONS.CHANGES_SAVED',
    config: {
      timeout: 2000,
      icon: 'thumb_up',
    },
  }, { root: true })
},
async create ({ commit, dispatch, rootGetters }, data) {
  await activityTypes.create({ group: rootGetters['currentGroup/id'], ...data })
  dispatch('refresh')
},
 */

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
