<template>
  <StandardMap
    class="group-gallery-map"
    :markers="markers"
    :force-center="forceCenter"
    :force-zoom="forceZoom"
    :force-bounds="forceBounds"
    :padding-top-left="paddingTopLeft"
    :show-attribution="false"
  />
</template>

<script>
import StandardMap from '@/maps/components/StandardMap'
import { groupMarker } from '@/maps/components/markers'
import { latLngBounds } from 'leaflet/dist/leaflet-src.esm'

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
    paddingTopLeft: {
      default: null,
      type: Array,
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
      // Minimum "closest distance" is 10km, so it won't filter for unhelpful
      // distances like <3km if you happen to be 1km from a group...
      const closestDistance = Math.max(groups[0].distance, 10)
      const maxDistance = closestDistance * 3
      return groups.filter(group => group.distance < maxDistance)
    },
    forceBounds () {
      if (this.nearbyGroups.length === 0) return null
      const coordsForBounds = this.nearbyGroups.map(this.toLatLng)
      if (this.myCoordinates) {
        coordsForBounds.push(this.myCoordinates)
      }
      return latLngBounds(coordsForBounds).pad(0.2)
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
