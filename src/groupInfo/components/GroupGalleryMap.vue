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
    nearbyGroups () {
      if (this.singleGroup) return []

      // focus the map on the top few markers (closest)
      const groupCountForFocus = 3

      // if the groups are further than this, we don't consider them
      const groupCloseKm = 200

      return this.groupsWithCoordinates
        .filter(this.hasDistance)
        .filter(group => group.distance < groupCloseKm)
        .slice(0, groupCountForFocus)
    },
    forceBounds () {
      if (this.nearbyGroups.length === 0) return null
      const bounds = L.latLngBounds(this.nearbyGroups.map(this.toLatLng)).pad(0.2)
      if (this.offset.lat !== 0 || this.offset.lng !== 0) {
        // we have an offset!
        // make the bounds extended to incorporate the offset into the calculation
        const sw = bounds.getSouthWest()
        const offsetPoint = L.latLng(sw.lat + this.offset.lat, sw.lng + this.offset.lng)
        return bounds.extend(offsetPoint)
      }
      return bounds
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
        return { lat: gp.latitude + this.offset.lat, lng: gp.longitude + this.offset.lng }
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
        return this.expanded ? { lat: 0, lng: -0.4 } : { lat: 0.05, lng: 0 }
      }
      return { lat: 0.0, lng: 0.0 }
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
