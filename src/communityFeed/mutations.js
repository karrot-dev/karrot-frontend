import { useMutation } from '@tanstack/vue-query'

import api from '@/communityFeed/api/communityFeed'
import { withStatus } from '@/utils/queryHelpers'

export function useMarkCommunityFeedMutation () {
  return withStatus(useMutation(() => api.markSeen()))
}
