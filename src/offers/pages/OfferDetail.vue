<template>
  <div
    class="absolute-full column"
  >
    <div class="col-auto">
      <OfferDetailHeader />
    </div>
    <div class="col relative-position">
      <OfferDetailBody inline />
    </div>
  </div>
</template>

<script>
import OfferDetailHeader from '@/offers/pages/OfferDetailHeader'
import OfferDetailBody from '@/offers/pages/OfferDetailBody'

export default {
  components: {
    OfferDetailBody,
    OfferDetailHeader,
  },
}
</script>
