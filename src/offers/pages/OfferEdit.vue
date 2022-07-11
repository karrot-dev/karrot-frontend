<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
<template>
  <OfferForm
    :fetching="$store.getters['currentOffer/fetching']"
    :value="$store.getters['currentOffer/value']"
    :status="$store.getters['currentOffer/saveStatus']"
    @save="data => $store.dispatch('offers/save', data)"
    @reset="$store.dispatch('offers/meta/clear', ['save'])"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import OfferForm from '@/offers/components/OfferForm'

export default {
  components: {
    OfferForm,
  },
}
</script>
