<template>
  <div>
    <StandardMap
      class="group-gallery-map"
      :markers="markers"
      :force-center="coords"
      :force-zoom="zoom"
      :show-attribution="false"/>
  </div>
</template>

<script>
import StandardMap from '@/components/Map/StandardMap'
import L from 'leaflet'

export default {
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
  methods: {
    groupMarkerId (id) {
      return `group_${id}`
    },
    createJoinedGroupMarker (group) {
      return this.createGroupMarker(group, 'blue')
    },
    createOpenGroupMarker (group) {
      return this.createGroupMarker(group, 'green')
    },
    createGroupMarker (group, color) {
      return {
        latLng: L.latLng(group.latitude, group.longitude),
        id: this.groupMarkerId(group.id),
        icon: L.AwesomeMarkers.icon({
          icon: 'home',
          markerColor: color,
          prefix: 'fa',
        }),
        popupcontent: `<h4><a href="/#/group/${group.id}/">${group.name}</a><h4>`,
      }
    },
  },
  computed: {
    markers () {
      let items = []
      let openGroupsWithCoords = this.filteredOtherGroups.filter(group => {
        return group.latitude != null && group.longitude != null
      })
      items.push(...openGroupsWithCoords.map(this.createOpenGroupMarker))

      let joinedGroupsWithCoords = this.filteredMyGroups.filter(group => {
        return group.latitude != null && group.longitude != null
      })
      items.push(...joinedGroupsWithCoords.map(this.createJoinedGroupMarker))
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
        return {lat: gp.latitude + this.offset[0], lng: gp.longitude + this.offset[1]}
      }
      return {lat: 0.0, lng: -100}
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
  components: { StandardMap },
}
</script>

<style scoped lang="stylus">
</style>
