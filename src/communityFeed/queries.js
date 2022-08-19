import { unref, computed } from 'vue'
import { useQuery } from 'vue-query'

import api from '@/communityFeed/api/communityFeed'

export const QUERY_KEY_BASE = 'communityFeed'
export const queryKeyCommunityFeed = () => [QUERY_KEY_BASE, 'feed']
export const queryKeyCommunityFeedMeta = () => [QUERY_KEY_BASE, 'feed-meta']
export const queryKeyCommunityTopic = topicId => [QUERY_KEY_BASE, 'topic', topicId]

export function useCommunityFeedQuery (queryOptions = {}) {
  const query = useQuery(
    queryKeyCommunityFeed(),
    () => api.latestTopics(),
    {
      placeholderData: () => [],
      ...queryOptions,
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
    () => api.getTopic(unref(topicId)),
    {
      enabled: computed(() => Boolean(unref(topicId))),
    },
  )
  return {
    ...query,
    topic: query.data,
  }
}
