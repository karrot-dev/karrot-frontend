<template>
  <Map class="map"/>
</template>

<script>
import Map from '@/components/Map/GroupMap.vue'

export default {
  components: { Map },
}
</script>

<style scoped lang="stylus">
.map
  width: 100%
  height: 100vh
</style>
