<template>
  <OfferForm
    :status="$store.getters['offers/createStatus']"
    @save="data => $store.dispatch('offers/create', data)"
    @reset="$store.dispatch('offers/meta/clear', ['create'])"
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
