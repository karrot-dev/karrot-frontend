import { useQuery } from 'vue-query'

import api from '@/communityFeed/api/communityFeed'
import { useAuthService } from '@/authuser/services'

// Magic topics on community.karrot.world forum that we use for banner updates
const COMMUNITY_BANNER_TOPIC_ID = process.env.KARROT.BACKEND === 'https://karrot.world' ? 933 : 930

export const QUERY_KEY_BASE = 'communityFeed'
export const queryKeyCommunityFeed = () => [QUERY_KEY_BASE, 'feed']
export const queryKeyCommunityFeedMeta = () => [QUERY_KEY_BASE, 'feed-meta']
export const queryKeyCommunityBannerQuery = () => [QUERY_KEY_BASE, 'banner']

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

export function useCommunityBannerQuery () {
  const query = useQuery(
    queryKeyCommunityBannerQuery(),
    () => api.getTopic(COMMUNITY_BANNER_TOPIC_ID),
    {
      select: topic => {
        // TODO: too much logic here?
        const { posts } = topic.postStream
        posts.shift() // remove the first one, the first post in the topic is not an announcement
        if (posts.length > 0) {
          const post = posts[posts.length - 1]
          const id = getDismissedBannerId()
          if (!id || (post.id > id)) { // assuming post ids always increment...
            return { id: post.id, html: post.cooked }
          }
        }
        return undefined
      },
    },
  )
  return {
    ...query,
    banner: query.data,
  }
}

function getDismissedBannerId () {
  if (window.localStorage) {
    const item = window.localStorage.getItem('dismissedBanner')
    if (item) {
      return JSON.parse(item).id
    }
    return null
  }
}
