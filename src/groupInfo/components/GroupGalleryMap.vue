<template>
  <StandardMap
    class="group-gallery-map"
    :markers="markers"
    :force-center="coords"
    :force-zoom="zoom"
    :show-attribution="false"
  />
</template>

<script>
import StandardMap from '@/maps/components/StandardMap'
import { groupMarker } from '@/maps/components/markers'

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
    markers () {
      let items = []
      let openGroupsWithCoords = this.filteredOtherGroups.filter(group => {
        return group.latitude != null && group.longitude != null
      })
      items.push(...openGroupsWithCoords.map(groupMarker))

      let joinedGroupsWithCoords = this.filteredMyGroups.filter(group => {
        return group.latitude != null && group.longitude != null
      })
      items.push(...joinedGroupsWithCoords.map(groupMarker))
      return items
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
    coords () {
      if (this.singleGroup) {
        let gp = this.singleGroup
        return { lat: gp.latitude + this.offset[0], lng: gp.longitude + this.offset[1] }
      }
      return { lat: 0.0, lng: -100 }
    },
    zoom () {
      if (this.singleGroup) {
        return 10
      }
      return window.innerHeight > 767 ? 2 : 1
    },
    offset () {
      if (window.innerWidth > 767 && this.$q.platform.is.desktop) {
        return this.expanded ? [-0.05, -0.4] : [0.0, -0.2]
      }
      return [0.0, 0.0]
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
