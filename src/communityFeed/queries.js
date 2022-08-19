import { unref, computed } from 'vue'
import { useQuery } from 'vue-query'

import { useAuthService } from '@/authuser/services'
import api from '@/communityFeed/api/communityFeed'

export const QUERY_KEY_BASE = 'communityFeed'
export const queryKeyCommunityFeed = () => [QUERY_KEY_BASE, 'feed']
export const queryKeyCommunityFeedMeta = () => [QUERY_KEY_BASE, 'feed-meta']
export const queryKeyCommunityTopic = topicId => [QUERY_KEY_BASE, 'topic', topicId]

export function useCommunityFeedQuery () {
  const { isLoggedIn } = useAuthService()
  const query = useQuery(
    queryKeyCommunityFeed(),
    () => api.latestTopics(),
    {
      enabled: isLoggedIn,
      placeholderData: () => [],
    },
  )
  return {
    ...query,
    latestTopics: query.data,
  }
}

export function useCommunityFeedMetaQuery () {
  const { isLoggedIn } = useAuthService()
  const query = useQuery(
    queryKeyCommunityFeedMeta(),
    () => api.getMeta(),
    {
      enabled: isLoggedIn,
      placeholderData: () => {},
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
