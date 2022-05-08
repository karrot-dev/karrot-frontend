<template>
  <OfferForm
    :fetching="$store.getters['currentOffer/fetching']"
    :value="$store.getters['currentOffer/value']"
    :status="$store.getters['currentOffer/saveStatus']"
    @save="data => $store.dispatch('offers/save', data)"
    @reset="$store.dispatch('offers/meta/clear', ['save'])"
  />
</template>

<script>
import OfferForm from '@/offers/components/OfferForm'

export default {
  components: {
    OfferForm,
  },
}
</script>
