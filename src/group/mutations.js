import { useMutation } from '@tanstack/vue-query'
import { unref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/group/api/groups'
import { useCurrentGroupService } from '@/group/services'
import { useGroupInfoService } from '@/groupInfo/services'
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

export function useSaveGroupMutation ({ redirectAfterSave = true } = {}) {
  const router = useRouter()
  return withStatus(useMutation(
    async group => api.save(group),
    {
      onSuccess (updatedGroup) {
        if (redirectAfterSave) {
          router.push({ name: 'group', params: { groupId: updatedGroup.id } })
        }
      },
    },
  ))
}

export function useLeaveGroupMutation () {
  const { clearGroup } = useCurrentGroupService()
  const { getGroupById } = useGroupInfoService()
  return withStatus(useMutation(
    groupId => api.leave(groupId),
    {
      onSuccess (_, groupId) {
        const group = getGroupById(groupId)
        showToast({
          message: 'GROUP.LEAVE_CONFIRMATION',
          messageParams: { groupName: group.name },
        })
        clearGroup()
        router.replace({ name: 'groupsGallery' })
      },
    },
  ))
}

export function useTrustUserMutation () {
  return withStatus(useMutation(
    ({ groupId, userId, role }) => api.trustUser(groupId, userId, role),
  ))
}

export function useRevokeTrustMutation () {
  return withStatus(useMutation(
    ({ groupId, userId, role }) => api.revokeTrust(groupId, userId, role),
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
