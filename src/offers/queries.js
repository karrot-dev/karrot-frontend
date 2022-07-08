import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from 'vue-query'
import { unref, computed } from 'vue'

import api from './api/offers'

import { useRoute, useRouter } from 'vue-router'
import { isValidationError } from '@/utils/datastore/helpers'
import { useCurrentGroupId } from '@/group/datastore/currentGroup'

export const DEFAULT_STATUS = 'active'

/**
 * Gives you a reference to the current offer, based on the route
 */
export function useCurrentOffer () {
  const route = useRoute()
  const id = computed(() => route.params.offerId && Number(route.params.offerId))
  const { offer } = useOfferQuery({ id })
  return offer
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
    ['offer', id],
    () => api.get(unref(id)),
    {
      // TODO: does this handle our currentOffer/clear case?
      enabled: computed(() => !!unref(id)),
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
 * Returns a pagination query object with additional "offers" item with flattened list of all offers
 */
export function useOffersQuery ({
  group,
  status = 'active',
}) {
  const query = useInfiniteQuery(
    ['offers', group, status],
    ({ pageParam }) => {
      return api.list({ group: unref(group), status: unref(status), cursor: pageParam })
    },
    {
      enabled: computed(() => !!unref(group)),
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
 * Use for saving an existing offer
 *
 * Returns a mutation object with validationErrors
 */
export function useSaveOfferMutation () {
  const { routeToOffer, updateQueryData } = useOfferUtils()
  const mutation = useMutation(
    offer => api.save(offer),
    {
      onSuccess (updatedOffer) {
        updateQueryData(updatedOffer)
        routeToOffer(updatedOffer)
      },
    },
  )
  return withValidationErrors(mutation)
}

/**
 * Use for creating a new offer
 *
 * Returns a mutation object with validationErrors
 */
export function useCreateOfferMutation () {
  const { routeToOffer, updateQueryData } = useOfferUtils()
  const groupId = useCurrentGroupId()
  const mutation = useMutation(
    offer => api.create({ ...offer, group: unref(groupId) }),
    {
      onSuccess (updatedOffer) {
        updateQueryData(updatedOffer)
        routeToOffer(updatedOffer)
      },
    },
  )
  return withValidationErrors(mutation)
}

/**
 * Archive an offer
 *
 * Returns a mutation object with validationErrors
 */
export function useArchiveOfferMutation () {
  const queryClient = useQueryClient()
  const { updateQueryData } = useOfferUtils()
  const mutation = useMutation(
    ({ offerId }) => api.archive(offerId),
    {
      onSuccess (updatedOffer) {
        updateQueryData(updatedOffer)
        queryClient.refetchQueries(['offers'])
      },
    },
  )
  return withValidationErrors(mutation)
}

// Utilities

function useOfferUtils () {
  const queryClient = useQueryClient()
  const router = useRouter()
  return {
    updateQueryData (offer) {
      // TODO: could update/invalidate the offers queries... but just rely on those being reloaded anyway
      queryClient.setQueryData(
        ['offer', offer.id],
        () => offer,
      )
    },
    routeToOffer (offer) {
      router.push({
        name: 'offerDetail',
        params: {
          groupId: offer.group,
          offerId: offer.id,
        },
        query: router.currentRoute.query,
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
function extractValidationErrors (error) {
  error = unref(error)
  if (!error || !isValidationError(error)) return {}
  return error.response.data
}

// TODO: move to queries utility function place
function withValidationErrors (mutation) {
  return {
    ...mutation,
    validationErrors: computed(() => extractValidationErrors(mutation.error)),
  }
}
