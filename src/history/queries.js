import { unref, computed } from 'vue'
import { useInfiniteQuery, useQuery } from 'vue-query'

import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

import api from './api/history'

export const QUERY_KEY_BASE = 'history'
export const queryKeyHistoryDetail = historyId => [QUERY_KEY_BASE, 'detail', historyId].filter(Boolean)
export const queryKeyHistoryList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)

export function useHistoryDetailQuery ({ historyId }) {
  const query = useQuery(
    queryKeyHistoryDetail(historyId),
    () => api.get(unref(historyId)),
    {
      enabled: computed(() => Boolean(unref(historyId))),
    },
  )
  return {
    ...query,
    historyItem: query.data,
  }
}

export function useHistoryListQuery ({ groupId, placeId, userId, agreementId, typus }, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyHistoryList({ groupId, placeId, userId, typus }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      place: unref(placeId),
      users: unref(userId),
      agreement: unref(agreementId),
      typus: unref(typus),
      cursor: pageParam,
    }),
    {
      enabled: computed(() => [groupId, placeId, userId, agreementId].some(val => unref(val))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
      // keep it simple, don't leave it lying around cached...
      cacheTime: 1000,
      staleTime: 0,
      ...queryOptions,
    },
  )
  return {
    ...query,
    history: flattenPaginatedData(query),
  }
}
