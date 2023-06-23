import { computed, getCurrentInstance, unref } from 'vue'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'

import { isMutating } from '@/offers/mutations'
import { useSocketEvents } from '@/utils/composables'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'

import api from './api/offers'

export const QUERY_KEY_BASE = 'offers'
export const queryKeyOfferList = (group, status) => [QUERY_KEY_BASE, 'list', group, status].filter(Boolean)
export const queryKeyOfferDetail = id => [QUERY_KEY_BASE, 'detail', id].filter(Boolean)

export const DEFAULT_STATUS = 'active'

/**
 * Handler for socket updates
 */
export function useOffersUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    [
      'offers:offer',
      'offers:offer_deleted',
    ],
    // We could do fiddly updates to the data, but simpler to just invalidate the lot
    async offer => {
      // Invalidate the list
      await queryClient.invalidateQueries(queryKeyOfferList())

      // Only invalidate the detail if we are not currently mutating it
      if (!isMutating(offer.id)) {
        await queryClient.invalidateQueries(queryKeyOfferDetail())
      }
    },
  )
}

/**
 * Fetch an offer by id
 *
 * Returns a query object with data also available "offer" key
 */
export function useOfferDetailQuery ({
  offerId,
}) {
  const query = useQuery(
    queryKeyOfferDetail(offerId),
    () => api.get(unref(offerId)),
    {
      enabled: computed(() => Boolean(unref(offerId))),
      staleTime: Infinity, // rely on websockets
    },
  )
  return {
    ...query,
    offer: query.data,
  }
}

/**
 * Query offers by group and status
 *
 * Returns a paginated query object with additional "offers" item with flattened list of all offers
 */
export function useOfferListQuery ({
  groupId,
  status = 'active',
}) {
  const query = useInfiniteQuery(
    queryKeyOfferList(groupId, status),
    ({ pageParam }) => {
      return api.list({
        group: unref(groupId),
        status: unref(status),
        cursor: pageParam,
      })
    },
    {
      enabled: computed(() => Boolean(unref(groupId))),
      staleTime: Infinity,
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
    },
  )

  return {
    ...query,
    offers: flattenPaginatedData(query),
  }
}
