import { unref } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'
import { useRoute, useRouter } from 'vue-router'

import api from '@/offers/api/offers'
import { queryKeyOfferDetail, queryKeyOfferList } from '@/offers/queries'
import { withStatus } from '@/utils/queryHelpers'

// Store the ids we are currently mutating, so we can better decide when to refresh from websocket
const mutatingOfferIds = new Set()

export function isMutating (id) {
  return mutatingOfferIds.has(id)
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
export function useCreateOfferMutation ({ groupId }) {
  const queryClient = useQueryClient()
  const { goToOffer } = useOfferUtils()
  const mutation = useMutation(
    offer => api.create({ ...offer, group: unref(groupId) }),
    {
      async onSuccess (offer) {
        await queryClient.setQueryData(queryKeyOfferDetail(offer.id), offer)
        // TODO: maybe move routing stuff to where it's called from?
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
