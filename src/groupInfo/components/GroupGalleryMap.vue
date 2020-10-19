<template>
  <StandardMap
    class="group-gallery-map"
    :markers="markers"
    :force-center="forceCenter"
    :force-zoom="forceZoom"
    :force-bounds="forceBounds"
    :show-attribution="false"
  />
</template>

<script>
import StandardMap from '@/maps/components/StandardMap'
import { groupMarker } from '@/maps/components/markers'
import L from 'leaflet'

export default {
  components: { StandardMap },
  props: {
    filteredMyGroups: {
      default: () => [],
      type: Array,
    },
    filteredOtherGroups: {
      required: true,
      type: Array,
    },
    expanded: {
      default: true,
      type: Boolean,
    },
  },
  computed: {
    groupsWithCoordinates () {
      return [
        ...this.filteredMyGroups,
        ...this.filteredOtherGroups,
      ].filter(this.hasCoordinates)
    },
    markers () {
      return this.groupsWithCoordinates.map(groupMarker)
    },
    groupsForBounds () {
      if (this.singleGroup) return []
      // focus the map on the top few markers (closest)
      const groupCountForFocus = 3
      return this.groupsWithCoordinates.filter(this.hasDistance).slice(0, groupCountForFocus)
    },
    forceBounds () {
      if (this.groupsForBounds.length === 0) return null
      return L.latLngBounds(this.groupsForBounds.map(this.toLatLng)).pad(0.2)
    },
    singleGroup () {
      if (this.groupsWithCoordinates.length === 1) {
        return this.groupsWithCoordinates[0]
      }
      return false
    },
    forceCenter () {
      if (this.singleGroup) {
        const gp = this.singleGroup
        return { lat: gp.latitude + this.offset[0], lng: gp.longitude + this.offset[1] }
      }
      return null
    },
    forceZoom () {
      if (this.singleGroup) {
        return 10
      }
      return null
    },
    offset () {
      if (window.innerWidth > 767 && this.$q.platform.is.desktop) {
        return this.expanded ? [-0.05, -0.4] : [0.0, -0.2]
      }
      return [0.0, 0.0]
    },
  },
  methods: {
    hasCoordinates (item) {
      return item.latitude != null && item.longitude != null
    },
    hasDistance (item) {
      return item.distance !== null
    },
    toLatLng (item) {
      return { lat: item.latitude, lng: item.longitude }
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
