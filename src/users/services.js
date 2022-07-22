import { computed } from 'vue'
import { useUserListAllQuery } from '@/users/queries'
import { indexBy, indexById, defineService } from '@/utils/datastore/helpers'

export const useUserService = defineService('users', () => {
  // queries
  const { isLoading, users } = useUserListAllQuery()

  // computed
  const usersById = computed(() => indexById(users.value))
  const usersByUsername = computed(() => indexBy(users.value, 'username'))

  // methods
  function getUserById (id) {
    return usersById.value[id]
  }

  return {
    isLoading,
    users,
    usersById,
    usersByUsername,
    getUserById,
  }
})
