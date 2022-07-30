import { computed } from 'vue'
import { useUserListAllQuery } from '@/users/queries'
import { indexBy, indexById, defineService } from '@/utils/datastore/helpers'
import { useAuthService } from '@/authuser/services'

export const useUserService = defineService(() => {
  // Services
  const { isLoggedIn } = useAuthService()

  // queries
  const { isLoading, users } = useUserListAllQuery({
    enabled: isLoggedIn,
  })

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
