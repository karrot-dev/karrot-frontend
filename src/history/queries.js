import { unref, computed } from 'vue'
import { useInfiniteQuery } from 'vue-query'

import api from './api/history'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'history'
export const queryKeyHistoryList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)

export function useHistoryListQuery ({ groupId, placeId, userId }, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyHistoryList({ groupId, placeId, userId }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      place: unref(placeId),
      users: unref(userId),
      cursor: pageParam,
    }),
    {
      enabled: computed(() => Boolean(unref(groupId) || unref(placeId) || unref(userId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
      // keep it simple, don't leave it lying around cached...
      cacheTime: 0,
      staleTime: 0,
      ...queryOptions,
    },
  )
  return {
    ...query,
    history: flattenPaginatedData(query),
  }
}
