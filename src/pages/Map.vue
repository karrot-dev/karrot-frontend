<template>
  <div>
    <div class="placeholder"/>
    <Map class="map"/>
  </div>
</template>

<script>
import Map from '@/components/Map/GroupMap.vue'

export default {
  components: { Map },
}
</script>

<style scoped lang="stylus">
.map
  position absolute
  height 100vh
  width 100vw
  left 0
  top 0
.placeholder
  height 100vh
  width 100vw
</style>
