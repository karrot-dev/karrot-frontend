import { unref } from 'vue'
import { useMutation } from 'vue-query'
import { useRouter } from 'vue-router'

import api from '@/group/api/groups'
import { useCurrentGroupService } from '@/group/services'
import router from '@/router'
import { withStatus } from '@/utils/queryHelpers'
import { showToast } from '@/utils/toasts'

export function useCreateGroupMutation () {
  const router = useRouter()
  return withStatus(useMutation(
    group => api.create(group),
    {
      onSuccess (createdGroup) {
        router.push({ name: 'group', params: { groupId: createdGroup.id } })
      },
    },
  ))
}

export function useSaveGroupMutation () {
  const router = useRouter()
  return withStatus(useMutation(
    group => api.save(group),
    {
      onSuccess (updatedGroup) {
        router.push({ name: 'group', params: { groupId: updatedGroup.id } })
      },
    },
  ))
}

export function useLeaveGroupMutation () {
  const { clearGroup } = useCurrentGroupService()
  return withStatus(useMutation(
    groupId => api.leave(groupId),
    {
      onSuccess (foo) {
        console.log('left group!', foo)
        // showToast({
        //   message: 'GROUP.LEAVE_CONFIRMATION',
        //   messageParams: { groupName: getters.get(groupId).name },
        // })

        clearGroup()
        router.replace({ name: 'groupsGallery' })
      },
    },
  ))
}

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
