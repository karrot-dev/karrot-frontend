import { computed, unref } from 'vue'

import { useUserService } from '@/users/services'

export function useUser (userId) {
  const {
    getUserById,
  } = useUserService()
  return computed(() => getUserById(unref(userId)))
}
