import { unref } from 'vue'

import { useAuthService } from '@/authuser/services'

export function useAuthHelpers () {
  const { userId: currentUserId } = useAuthService()

  function getIsCurrentUser (userOrId) {
    userOrId = unref(userOrId)
    if (typeof userOrId === 'number') {
      return currentUserId.value === userOrId
    }
    return currentUserId.value === userOrId.id
  }

  return {
    getIsCurrentUser,
  }
}
