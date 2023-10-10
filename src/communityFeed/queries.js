import { useQuery } from '@tanstack/vue-query'
import { unref, computed } from 'vue'

import api from '@/communityFeed/api/communityFeed'

export const QUERY_KEY_BASE = 'communityFeed'
export const queryKeyCommunityFeed = feed => [QUERY_KEY_BASE, 'feed', feed]
export const queryKeyCommunityFeedMeta = () => [QUERY_KEY_BASE, 'feed-meta']
export const queryKeyCommunityTopic = topicId => [QUERY_KEY_BASE, 'topic', topicId]

export function useCommunityFeedQuery ({ feed }) {
  const query = useQuery(
    queryKeyCommunityFeed(feed),
    () => {
      const value = unref(feed)
      if (!value) return []
      return api.latestTopics(value)
    },
    {
      placeholderData: () => [],
      enabled: computed(() => Boolean(unref(feed))),
    },
  )

  return {
    ...query,
    latestTopics: query.data,
  }
}

export function useCommunityFeedMetaQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyCommunityFeedMeta(),
    () => api.getMeta(),
    {
      placeholderData: () => {},
      ...queryOptions,
    },
  )
  return {
    ...query,
    meta: query.data,
  }
}

export function useCommunityTopicQuery ({ topicId }) {
  const query = useQuery(
    queryKeyCommunityTopic(topicId),
    () => {
      const value = unref(topicId)
      if (!value) return {}
      return api.getTopic(value)
    },
    {
      enabled: computed(() => Boolean(unref(topicId))),
    },
  )
  return {
    ...query,
    topic: query.data,
  }
}
