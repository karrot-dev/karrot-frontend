import { computed, unref } from 'vue'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'

import api from '@/agreements/api/agreements'
import { paginationHelpers } from '@/messages/queries'
import { useSocketEvents } from '@/utils/composables'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'agreements'
export const queryKeyAgreementList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyAgreementItem = agreementId => [QUERY_KEY_BASE, 'item', agreementId].filter(Boolean)

/**
 * Handler for socket updates
 */
export function useAgreementsUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on('agreements:agreement', async agreement => {
    // TODO: slighty more optimal one would be directly update matching item query
    await queryClient.invalidateQueries([QUERY_KEY_BASE])
  })
}

export function useAgreementListQuery ({
  groupId,
  active,
  reviewDue,
  pageSize = 10,
}, queryOptions = {}) {
  const query = useInfiniteQuery(
    queryKeyAgreementList({ groupId, active, reviewDue }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      active: unref(active),
      reviewDue: unref(reviewDue),
      cursor: pageParam,
      pageSize,
    }),
    {
      cacheTime: 1000,
      staleTime: 1000,
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
    ...paginationHelpers(query),
    agreements: flattenPaginatedData(query),
  }
}

export function useAgreementItemQuery ({ agreementId }, queryOptions = {}) {
  const query = useQuery(
    queryKeyAgreementItem(agreementId),
    () => api.get(unref(agreementId)),
    {
      enabled: computed(() => Boolean(unref(agreementId))),
      ...queryOptions,
    },
  )
  return {
    ...query,
    agreement: query.data,
  }
}
