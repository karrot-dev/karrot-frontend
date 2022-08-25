<template>
  <div class="placeholder">
    <GroupMap
      class="map"
      controls="full"
      :force-center="center"
      :force-zoom="zoom"
      @map-move-end="mapMoveEnd"
    />
  </div>
</template>

<script>
import { throttle } from 'quasar'

import GroupMap from '@/maps/components/GroupMap'

export default {
  components: { GroupMap },
  computed: {
    center () {
      return { lat: Number(this.$route.query.lat), lng: Number(this.$route.query.lng) }
    },
    zoom () {
      return Number(this.$route.query.zoom)
    },
  },
  created () {
    this.mapMoveEnd = throttle(this.mapMoveEnd, 500)
  },
  methods: {
    mapMoveEnd (target) {
      this.$router.replace({
        query: {
          lat: target.getCenter().lat,
          lng: target.getCenter().lng,
          zoom: target.getZoom(),
        },
      })
    },
  },
}
</script>

<style lang="sass">
.map
  width: 100%
  height: 100%

.placeholder
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
</style>
