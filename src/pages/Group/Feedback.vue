<template>
  <div class="wrapper shadow-1">
    <PickupFeedback/>
  </div>
</template>

<script>
import PickupFeedback from '@/components/Statistics/PickupFeedback.vue'

export default {
  components: {
    PickupFeedback,
  },
  metaInfo () {
    return {
      title: `${this.myGroup.name}`,
    }
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  background-color white
  border-radius 10px
  padding 1em
</style>
