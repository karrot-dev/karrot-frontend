import { computed } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { useAuthUserQuery } from '@/authuser/queries'

export const useAuthService = defineService(() => {
  // queries
  const {
    user,
    refetch,
    wait: waitForUserToLoad,
    isRefetching,
  } = useAuthUserQuery()

  // computed
  const userId = computed(() => user.value?.id)
  const isLoggedIn = computed(() => !!user.value)

  // actions
  async function refresh () {
    if (isRefetching.value) return
    await refetch()
  }

  return {
    userId,
    isLoggedIn,
    user,
    refresh,
    waitForUserToLoad,
    status,
  }
})
