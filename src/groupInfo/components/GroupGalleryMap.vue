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
    myCoordinates: {
      default: null,
      type: Object,
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
      const groups = this.groupsWithCoordinates.filter(this.hasDistance)
      if (groups.length === 0) return []
      // Any group with max 3x distance of the closest group
      // Minimum "closest distance" is 30km, so it won't filter for unhelpful
      // distances like <3km if you happen to be 1km from a group...
      const closestDistance = Math.max(groups[0].distance, 30)
      const maxDistance = closestDistance * 3
      return groups.filter(group => group.distance < maxDistance)
    },
    forceBounds () {
      if (this.nearbyGroups.length === 0) return null
      const coordsForBounds = this.nearbyGroups.map(this.toLatLng)
      if (this.myCoordinates) {
        coordsForBounds.push(this.myCoordinates)
      }
      const bounds = L.latLngBounds(coordsForBounds).pad(0.2)
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
