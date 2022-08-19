import { ref, computed } from 'vue'

import { useCommunityFeedMetaQuery, useCommunityFeedQuery, useCommunityTopicQuery } from '@/communityFeed/queries'
import { defineService } from '@/utils/datastore/helpers'

export const useCommunityFeedService = defineService(() => {
  const {
    latestTopics,
  } = useCommunityFeedQuery()

  const {
    meta,
  } = useCommunityFeedMetaQuery()

  function getIsUnread (topic) {
    return meta.value?.markedAt && topic.lastPostedAt > meta.value.markedAt
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

export const useCommunityBannerService = defineService(() => {
// Magic topics on community.karrot.world forum that we use for banner updates
  const topicId = process.env.KARROT.BACKEND === 'https://karrot.world' ? 933 : 930

  const { topic } = useCommunityTopicQuery({ topicId })

  const dismissedBannerId = ref(getDismissedBannerIdFromLocalStorage())

  const communityBanner = computed(() => {
    if (topic.value) {
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
