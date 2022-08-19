import { useOfferDetailQuery } from '@/offers/queries'
import { useIntegerRouteParam } from '@/utils/composables'
import { defineService } from '@/utils/datastore/helpers'

export const useActiveOfferService = defineService(() => {
  // services
  const offerId = useIntegerRouteParam('offerId')

  // queries
  const {
    offer,
    isLoading,
  } = useOfferDetailQuery({ offerId })

  return {
    offerId,
    offer,
    isLoading,
  }
})
