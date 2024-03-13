import { ref, computed } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useConfigQuery } from '@/base/queries'
import { useCommunityFeedMetaQuery, useCommunityFeedQuery, useCommunityTopicQuery } from '@/communityFeed/queries'
import { defineService } from '@/utils/datastore/helpers'

export const useCommunityFeedService = defineService(() => {
  const { isLoggedIn } = useAuthService()
  const { config } = useConfigQuery()
  const discussionsFeed = computed(() => isLoggedIn.value && config.value?.forum?.discussionsFeed)
  const {
    latestTopics,
  } = useCommunityFeedQuery({ feed: discussionsFeed })

  const {
    meta,
  } = useCommunityFeedMetaQuery({ enabled: isLoggedIn })

  function getIsUnread (topic) {
    return meta.value?.markedAt && topic.lastPostedAt > meta.value.markedAt
  }

  const entries = computed(() => {
    if (!latestTopics.value) return []
    return latestTopics.value
      .filter(topic => !topic.pinned)
      .map(topic => ({ topic, isUnread: getIsUnread(topic) }))
  })

  const unreadCount = computed(() => entries.value.filter(entry => entry.isUnread).length)
  return {
    entries,
    unreadCount,
  }
})

export const useCommunityBannerService = defineService(() => {
  const { config } = useConfigQuery()

  const bannerTopicId = computed(() => config.value?.forum?.bannerTopicId)

  const { topic } = useCommunityTopicQuery({ topicId: bannerTopicId })

  const dismissedBannerId = ref(getDismissedBannerIdFromLocalStorage())

  const communityBanner = computed(() => {
    if (topic.value?.postStream?.posts) {
      const posts = [...topic.value.postStream.posts]
      // remove the first one, the first post in the topic is not an announcement (by our definition)
      posts.shift()
      if (posts.length > 0) {
        const post = posts[posts.length - 1]
        const id = dismissedBannerId.value
        if (!id || (post.id > id)) { // assuming post ids always increment...
          return { id: post.id, html: post.cooked }
        }
      }
    }
    return undefined
  })

  function getDismissedBannerIdFromLocalStorage () {
    if (window.localStorage) {
      const item = window.localStorage.getItem('dismissedBanner')
      if (item) {
        return JSON.parse(item).id
      }
      return null
    }
  }

  function dismissCommunityBanner () {
    if (window.localStorage) {
      if (communityBanner.value) {
        const id = communityBanner.value.id
        dismissedBannerId.value = id
        window.localStorage.setItem(
          'dismissedBanner',
          JSON.stringify({ id }),
        )
      }
    }
  }

  return {
    communityBanner,
    dismissCommunityBanner,
  }
})
