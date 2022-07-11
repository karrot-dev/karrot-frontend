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
    :status="$store.getters['offers/createStatus']"
    @save="data => $store.dispatch('offers/create', data)"
    @reset="$store.dispatch('offers/meta/clear', ['create'])"
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
