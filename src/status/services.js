import { computed } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { useStatusQuery } from '@/status/queries'
import { useAuthService } from '@/authuser/services'

export const useStatusService = defineService(() => {
  // Services
  const { isLoggedIn } = useAuthService()

  // queries
  const { status } = useStatusQuery({
    enabled: isLoggedIn,
  })

  // computed
  const unseenConversationCount = computed(() => status.value.unseenConversationCount)
  const unseenThreadCount = computed(() => status.value.unseenThreadCount)
  const hasUnreadConversationsOrThreads = computed(() => status.value.hasUnreadConversationsOrThreads)
  const unseenNotificationCount = computed(() => status.value.unseenNotificationCount)
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
