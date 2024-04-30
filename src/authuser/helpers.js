import { computed, unref } from 'vue'

import { useAuthService } from '@/authuser/services'

export function useAuthHelpers () {
  const { userId: currentUserId } = useAuthService()

  function getIsCurrentUser (userOrId) {
    userOrId = unref(userOrId)
    if (!userOrId) return false
    if (typeof userOrId === 'number') {
      return currentUserId.value === userOrId
    }
    return currentUserId.value === userOrId.id
  }

  return {
    getIsCurrentUser,
  }
}

export function useIsCurrentUser (userOrId) {
  const { getIsCurrentUser } = useAuthHelpers()
  return computed(() => getIsCurrentUser(userOrId))
}

export function useCurrentUser () {
  const { user } = useAuthService()
  return user
}
