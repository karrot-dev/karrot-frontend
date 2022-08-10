import { defineService } from '@/utils/datastore/helpers'
import { useIntegerRouteParam } from '@/utils/composables'
import { useOfferDetailQuery } from '@/offers/queries'

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
