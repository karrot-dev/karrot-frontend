import { computed } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useStatusQuery } from '@/status/queries'
import { defineService } from '@/utils/datastore/helpers'

export const useStatusService = defineService(() => {
  // Services
  const { isLoggedIn } = useAuthService()

  // queries
  const { status } = useStatusQuery({
    enabled: isLoggedIn,
  })

  // computed
  const unseenConversationCount = computed(() => status.value?.unseenConversationCount || 0)
  const unseenThreadCount = computed(() => status.value?.unseenThreadCount || 0)
  const hasUnreadConversationsOrThreads = computed(() => status.value?.hasUnreadConversationsOrThreads || 0)
  const unseenNotificationCount = computed(() => status.value?.unseenNotificationCount || 0)
  const unseenCount = computed(() => unseenConversationCount.value + unseenThreadCount.value)

  // methods

  function getGroupStatus (groupId) {
    return status.value.groups[groupId] || {}
  }

  function getPlaceStatus (placeId) {
    return status.value.places[placeId] || {}
  }

  return {
    status,

    unseenConversationCount,
    unseenThreadCount,
    hasUnreadConversationsOrThreads,
    unseenCount,
    unseenNotificationCount,

    getGroupStatus,
    getPlaceStatus,
  }
})
