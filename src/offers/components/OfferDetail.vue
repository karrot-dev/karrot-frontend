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
import OfferDetailHeader from '@/offers/components/OfferDetailHeader'
import OfferDetailBody from '@/offers/components/OfferDetailBody'

export default {
  components: {
    OfferDetailBody,
    OfferDetailHeader,
  },
}
</script>
