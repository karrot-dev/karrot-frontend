import { computed, unref } from 'vue'
import { useInfiniteQuery } from 'vue-query'

import api from './api/feedback'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'feedback'
export const queryKeyFeedbackList = ({ groupId, placeId }) => [QUERY_KEY_BASE, { groupId, placeId }]

export function useFeedbackListQuery ({ groupId, placeId }) {
  const query = useInfiniteQuery(
    queryKeyFeedbackList({ groupId, placeId }),
    () => api.list({
      groupId: unref(groupId),
      placeId: unref(placeId),
    }),
    {
      enabled: computed(() => Boolean(unref(groupId) || unref(placeId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        // TODO: here we ignore the related activities returned, decide whether/if/how to use them
        pages: pages.map(page => page.results.feedback),
        pageParams,
      }),
    },
  )
  return {
    ...query,
    feedback: flattenPaginatedData(query),
  }
}
