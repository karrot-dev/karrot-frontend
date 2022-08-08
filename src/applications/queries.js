import { unref, computed } from 'vue'
import { useInfiniteQuery } from 'vue-query'

import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'
import api from './api/applications'

export const QUERY_KEY_BASE = 'applications'
export const queryKeyApplicationList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)

export function useApplicationListQuery ({
  groupId,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyApplicationList({ groupId }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      cursor: pageParam,
    }),
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: computed(() => Boolean(unref(groupId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
      ...queryOptions,
    },
  )

  return {
    ...query,
    applications: flattenPaginatedData(query),
  }
}
