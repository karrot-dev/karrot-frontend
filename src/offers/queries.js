import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from 'vue-query'
import { unref, computed } from 'vue'

import api from './api/offers'

import { useRoute, useRouter } from 'vue-router'
import { isNetworkError, isServerError, isValidationError } from '@/utils/datastore/helpers'
import { useCurrentGroupId } from '@/group/datastore/currentGroup'
import { useSocketEvents } from '@/utils/composables'

export const QUERY_KEY_BASE = 'offers'
export const queryKeyOfferList = (group, status) => [QUERY_KEY_BASE, 'list', group, status].filter(Boolean)
export const queryKeyOfferDetail = id => [QUERY_KEY_BASE, 'detail', id].filter(Boolean)

export const DEFAULT_STATUS = 'active'

// Store the ids we are currently mutating, so we can better decide when to refresh from websocket
const mutatingOfferIds = new Set()

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
      if (!mutatingOfferIds.has(offer.id)) {
        await queryClient.invalidateQueries(queryKeyOfferDetail())
      }
    },
  )
}

/**
 * Get current offer based on route
 *
 * Gives you a ref to the offer
 */
export function useCurrentOfferRef () {
  const { offer } = useCurrentOfferQuery()
  return offer
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
        return extractCursor(page.next)
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

/**
 * Save an existing offer
 *
 * Returns a mutation object with validationErrors
 */
export function useSaveOfferMutation () {
  const queryClient = useQueryClient()
  const { goToOffer } = useOfferUtils()
  const mutation = useMutation(
    offer => api.save(offer),
    {
      async onSuccess (offer) {
        await queryClient.setQueryData(queryKeyOfferDetail(offer.id), offer)
        goToOffer(offer)
      },
      onMutate (variables) {
        mutatingOfferIds.add(variables.id)
      },
      async onSettled (data, error, variables) {
        mutatingOfferIds.delete(variables.id)
        await queryClient.invalidateQueries(queryKeyOfferList())
      },
    },
  )
  return withStatus(mutation)
}

/**
 * Create a new offer
 *
 * Returns a mutation object with validationErrors
 */
export function useCreateOfferMutation () {
  const queryClient = useQueryClient()
  const { goToOffer } = useOfferUtils()
  const groupId = useCurrentGroupId()
  const mutation = useMutation(
    offer => api.create({ ...offer, group: unref(groupId) }),
    {
      async onSuccess (offer) {
        await queryClient.setQueryData(queryKeyOfferDetail(offer.id), offer)
        goToOffer(offer)
      },
      onMutate (variables) {
        mutatingOfferIds.add(variables.id)
      },
      async onSettled (data, error, variables) {
        mutatingOfferIds.delete(variables.id)
        await queryClient.invalidateQueries(queryKeyOfferList())
      },
    },
  )
  return withStatus(mutation)
}

/**
 * Archive an offer
 *
 * Returns a mutation object with validationErrors
 */
export function useArchiveOfferMutation () {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    ({ offerId }) => api.archive(offerId),
    {
      async onSuccess (offer) {
        await queryClient.setQueryData(queryKeyOfferDetail(offer.id), offer)
      },
    },
  )
  return withStatus(mutation)
}

// Utilities

function useOfferUtils () {
  const router = useRouter()
  const route = useRoute()
  return {
    goToOffer (offer) {
      router.push({
        name: 'offerDetail',
        params: {
          groupId: offer.group,
          offerId: offer.id,
        },
        query: route.query,
      }).catch(() => {})
    },
  }
}

// TODO: move to api utility function place
function extractCursor (url) {
  if (!url) return null
  return new URL(url, url.startsWith('http') ? null : 'https://karrot.world').searchParams.get('cursor')
}

// TODO: move to queries utility function place
function withStatus (mutation) {
  return {
    ...mutation,
    status: computed(() => mutationToStatus(mutation)),
  }
}

// TODO: move to queries utility function place
/**
 * Converts a vue-query mutation object to our existing "status" object type
 */
function mutationToStatus (mutation) {
  const error = unref(mutation.error)
  const validationErrors = isValidationError(error) ? error.response.data : []
  return {
    validationErrors,
    hasValidationErrors: validationErrors.length > 0,
    pending: mutation.isLoading.value,
    serverError: isServerError(error),
    networkError: isNetworkError(error),
  }
}
