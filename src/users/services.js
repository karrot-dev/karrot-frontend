import { computed, watch } from 'vue'

import { useRouteErrorService } from '@/base/services'
import { useUserListAllQuery, useUserProfileQuery } from '@/users/queries'
import { useIntegerRouteParam } from '@/utils/composables'
import { indexBy, indexById, defineService, isValidationError } from '@/utils/datastore/helpers'

export const useUserService = defineService(() => {
  // queries
  const { isLoading, users } = useUserListAllQuery()

  // computed
  const usersById = computed(() => indexById(users.value))
  const usersByUsername = computed(() => indexBy(users.value, 'username'))

  // methods
  function getUserById (id) {
    return usersById.value[id] || {
      id,
      isCurrentUser: false,
      displayName: '?',
      _unknown: true,
    }
  }

  return {
    isLoading,
    users,
    usersById,
    usersByUsername,
    getUserById,
  }
})

export const useActiveUserService = defineService(() => {
  const userId = useIntegerRouteParam('userId')
  const { setRouteError } = useRouteErrorService()

  const {
    user,
    error,
  } = useUserProfileQuery({ userId })

  watch(error, error => {
    if (isValidationError(error)) {
      setRouteError({ translation: 'PROFILE.INACCESSIBLE_OR_DELETED' })
    }
  })

  return {
    userId,
    user,
  }
})
