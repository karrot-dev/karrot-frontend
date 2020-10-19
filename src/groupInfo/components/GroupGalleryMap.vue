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
    joinedGroupsWithCoords () {
      return this.filteredMyGroups.filter(this.hasCoordinates)
    },
    otherGroupsWithCoords () {
      return this.filteredOtherGroups.filter(this.hasCoordinates)
    },
    markers () {
      return [
        ...this.joinedGroupsWithCoords.map(groupMarker),
        ...this.otherGroupsWithCoords.map(groupMarker),
      ]
    },
    markersForBounds () {
      return this.markers.slice(0, 2) // focus the map on the top few markers (closest)
    },
    forceBounds () {
      if (this.markersForBounds.length === 0) return null
      return L.latLngBounds(this.markersForBounds.map(m => m.latLng)).pad(0.2)
    },
    singleGroup () {
      if (this.filteredOtherGroups.length + this.filteredMyGroups.length === 1) {
        if (this.filteredOtherGroups.length === 1) {
          return this.filteredOtherGroups[0]
        }
        return this.filteredMyGroups[0]
      }
      return false
    },
    forceCenter () {
      if (this.singleGroup) {
        const gp = this.singleGroup
        return { lat: gp.latitude + this.offset[0], lng: gp.longitude + this.offset[1] }
      }
      return null
      // return { lat: 0.0, lng: -100 }
    },
    forceZoom () {
      if (this.singleGroup) {
        return 10
      }
      return null
      // return window.innerHeight > 767 ? 2 : 1
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
  },
}
</script>

<style scoped lang="stylus">
</style>
