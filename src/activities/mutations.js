import { useMutation } from 'vue-query'

import api from './api/activities'
import { withStatus } from '@/utils/queryHelpers'

export function useJoinActivityMutation () {
  return withStatus(useMutation(activityId => api.join(activityId)))
}

export function useLeaveActivityMutation () {
  return withStatus(useMutation(activityId => api.leave(activityId)))
}
