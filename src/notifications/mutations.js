import { useMutation } from 'vue-query'
import api from '@/notifications/api/notifications'
import { withStatus } from '@/utils/queryHelpers'

export function useMarkSeenMutation () {
  const mutation = useMutation(
    () => api.markSeen(),
  )
  return withStatus(mutation)
}

export function useMarkClickedMutation () {
  const mutation = useMutation(
    notificationId => api.markClicked(notificationId),
  )
  return withStatus(mutation)
}
