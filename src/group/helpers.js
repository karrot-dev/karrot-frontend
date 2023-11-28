import { unref } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'

export function useGroupHelpers () {
  const { groupId: currentGroupId } = useCurrentGroupService()

  function getIsCurrentGroup (group) {
    return currentGroupId.value === unref(group).id
  }

  return {
    getIsCurrentGroup,
  }
}

export function useMembershipHelpers () {
  const {
    userId: authUserId,
  } = useAuthService()

  const {
    group,
  } = useCurrentGroupService()

  function getIsEditor (membership) {
    return membership.roles.includes('editor')
  }

  function getIsTrusted (membership) {
    return membership.trustedBy.includes(authUserId.value)
  }

  function getTrustProgress (membership) {
    return getIsEditor(membership) ? 1 : membership.trustedBy.length / group.value.trustThresholdForNewcomer
  }

  return {
    getIsEditor,
    getIsTrusted,
    getTrustProgress,
  }
}

export function useCurrentGroupId () {
  const { groupId } = useCurrentGroupService()
  return groupId
}
