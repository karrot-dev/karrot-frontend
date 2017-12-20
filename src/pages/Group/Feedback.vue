<template>
  <div class="wrapper shadow-1">
    <PickupFeedback/>
  </div>
</template>

<script>
import PickupFeedback from '@/components/Statistics/PickupFeedback'

export default {
  components: {
    PickupFeedback,
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.wrapper
  background-color white
  border-radius 10px
.wrapper
  @media (min-width: $breakpoint-sm)
    padding 1em
</style>
