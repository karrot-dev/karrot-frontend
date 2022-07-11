import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'
import { computed, unref } from 'vue'

import api from './api/offers'

import { useRoute } from 'vue-router'
import { useSocketEvents } from '@/utils/composables'
import { extractCursor } from '@/utils/queryHelpers'
import { isMutating } from '@/offers/mutations'

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
 * Get current offer, based on route
 *
 * Gives a full query object
 */
export function useCurrentOfferQuery () {
  const route = useRoute()
  const id = computed(() => route.params.offerId && Number(route.params.offerId))
  return useOfferQuery({ id })
}

/**
 * Fetch an offer by id
 *
 * Returns a query object with data also available "offer" key
 */
export function useOfferQuery ({
  id,
}) {
  const query = useQuery(
    queryKeyOfferDetail(id),
    () => api.get(unref(id)),
    {
      // TODO: does this handle our currentOffer/clear case?
      enabled: computed(() => !!unref(id)),
      staleTime: Infinity,
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
export function useOffersQuery ({
  group,
  status = 'active',
}) {
  const query = useInfiniteQuery(
    queryKeyOfferList(group, status),
    ({ pageParam }) => {
      return api.list({ group: unref(group), status: unref(status), cursor: pageParam })
    },
    {
      enabled: computed(() => !!unref(group)),
      staleTime: Infinity,
      getNextPageParam (page) {
        const nextPageParam = extractCursor(page.next)
        console.log('nextPageParam is', nextPageParam)
        return nextPageParam
      },
      select ({ pages, pageParams }) {
        return {
          pages: pages.map(page => page.results),
          pageParams,
        }
      },
    },
  )

  // Flatten the pages, so we have a single offers array with all the results in
  const offers = computed(() => {
    const data = unref(query.data)
    if (!data) return []
    return data.pages.flat()
  })

  return {
    ...query,
    offers,
  }
}
