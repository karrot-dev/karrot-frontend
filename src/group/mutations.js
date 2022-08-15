import { unref } from 'vue'
import { useMutation } from 'vue-query'
import { withStatus } from '@/utils/queryHelpers'
import api from '@/group/api/groups'
import { showToast } from '@/utils/toasts'

export function useTrustUserMutation () {
  return withStatus(useMutation(
    ({ groupId, userId }) => api.trustUser(groupId, userId),
  ))
}

export function useRevokeTrustMutation () {
  return withStatus(useMutation(
    ({ groupId, userId }) => api.revokeTrust(groupId, userId),
  ))
}

export function useChangeNotificationTypesMutation ({ groupId }) {
  return withStatus(useMutation(
    ({ notificationType, enabled }) => {
      if (enabled) {
        return api.addNotificationType(unref(groupId), notificationType)
      }
      else {
        return api.removeNotificationType(unref(groupId), notificationType)
      }
    },
    {
      onSuccess () {
        showToast({
          message: 'NOTIFICATIONS.CHANGES_SAVED',
          config: {
            timeout: 2000,
            icon: 'thumb_up',
          },
        })
      },
    },
  ))
}
