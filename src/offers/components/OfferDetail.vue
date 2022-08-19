<template>
  <div
    class="absolute-full column"
  >
    <div class="col-auto full-width">
      <OfferDetailHeader />
    </div>
    <div class="col relative-position">
      <OfferDetailBody inline />
    </div>
  </div>
</template>

<script>
import OfferDetailBody from '@/offers/components/OfferDetailBody'
import OfferDetailHeader from '@/offers/components/OfferDetailHeader'

export default {
  components: {
    OfferDetailBody,
    OfferDetailHeader,
  },
}
</script>
