import { computed } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { useStatusQuery } from '@/status/queries'

export const useStatusService = defineService(() => {
  // queries
  const { status } = useStatusQuery()

  // computed
  const unseenConversationCount = computed(() => status.value.unseenConversationCount)
  const unseenThreadCount = computed(() => status.value.unseenThreadCount)
  const hasUnreadConversationsOrThreads = computed(() => status.value.hasUnreadConversationsOrThreads)
  const unseenCount = computed(() => status.value.unseenCount)
  const unseenNotificationCount = computed(() => status.value.unseenNotificationCount)

  // methods

  function getGroupStatus (groupId) {
    return status.value.groups[groupId] || {}
  }

  function getPlaceStatus (placeId) {
    return status.value.places[placeId] || {}
  }

  return {
    unseenConversationCount,
    unseenThreadCount,
    hasUnreadConversationsOrThreads,
    unseenCount,
    unseenNotificationCount,

    getGroupStatus,
    getPlaceStatus,
  }
})
