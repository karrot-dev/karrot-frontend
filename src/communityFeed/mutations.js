import { withStatus } from '@/utils/queryHelpers'
import { useMutation } from 'vue-query'

import api from '@/communityFeed/api/communityFeed'

export function useMarkCommunityFeedMutation () {
  return withStatus(useMutation(() => api.markSeen()))
}
