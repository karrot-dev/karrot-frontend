import { computed } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { useCommunityFeedMetaQuery, useCommunityFeedQuery } from '@/communityFeed/queries'

export const useCommunityFeedService = defineService(() => {
  const {
    latestTopics,
  } = useCommunityFeedQuery()

  const {
    meta,
  } = useCommunityFeedMetaQuery()

  function getIsUnread (topic) {
    return meta.value.markedAt && topic.lastPostedAt > meta.value.markedAt
  }

  const entries = computed(() => latestTopics.value
    .filter(topic => !topic.pinned)
    .map(topic => ({
      topic,
      isUnread: getIsUnread(topic),
    })))

  const unreadCount = computed(() => entries.value.filter(entry => entry.isUnread).length)
  return {
    entries,
    unreadCount,
  }
})
