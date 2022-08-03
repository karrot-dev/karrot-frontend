import { computed, watch } from 'vue'
import { useStore } from 'vuex'

import { defineService } from '@/utils/datastore/helpers'
import { useIntegerRouteParam } from '@/utils/composables'
import { useOfferDetailQuery } from '@/offers/queries'

export const useActiveOfferService = defineService(() => {
  // services
  // TODO: decouple from store
  const store = useStore()
  const offerId = useIntegerRouteParam('offerId')

  // queries
  const {
    offer,
    isLoading,
  } = useOfferDetailQuery({ offerId })

  // effects
  watch(offerId, () => {
    if (offerId.value) {
      store.dispatch('conversations/fetchForOffer', { offerId: offerId.value })
    }
  }, { immediate: true })

  // computed
  const conversation = computed(() => store.getters['conversations/getForOffer'](offerId.value))

  return {
    offerId,
    offer,
    conversation,
    isLoading,
  }
})
