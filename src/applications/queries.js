import { unref, computed } from 'vue'
import { useQuery, useInfiniteQuery, useQueryClient } from 'vue-query'

import { useSocketEvents } from '@/utils/composables'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

import api from './api/applications'

export const QUERY_KEY_BASE = 'applications'
export const queryKeyApplicationList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyApplicationItem = applicationId => [QUERY_KEY_BASE, 'item', applicationId].filter(Boolean)

export function useApplicationsUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    [
      'applications:update',
    ],
    async () => {
      await queryClient.invalidateQueries([QUERY_KEY_BASE])
    },
  )
}

export function useApplicationListQuery ({
  groupId,
  userId,
  status,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyApplicationList({ groupId, userId, status }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      user: unref(userId),
      status: unref(status),
      cursor: pageParam,
    }),
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: computed(() => Boolean(unref(groupId) || unref(userId) || unref(status))),
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
