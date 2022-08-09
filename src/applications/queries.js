import { unref, computed } from 'vue'
import { useQuery, useInfiniteQuery } from 'vue-query'

import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'
import api from './api/applications'

export const QUERY_KEY_BASE = 'applications'
export const queryKeyApplicationList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyApplicationItem = applicationId => [QUERY_KEY_BASE, 'item', applicationId].filter(Boolean)

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

export function useApplicationItemQuery ({ applicationId }, queryOptions = {}) {
  const query = useQuery(
    queryKeyApplicationItem(applicationId),
    () => api.get(unref(applicationId)),
    {
      enabled: computed(() => Boolean(unref(applicationId))),
      ...queryOptions,
    },
  )
  return {
    ...query,
    application: query.data,
  }
}
