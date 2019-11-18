<template>
  <div class="placeholder">
    <GroupMap
      class="map"
      controls="full"
      :users="users"
      :places="places"
      :groups="groups"
      :current-group="currentGroup"
      :is-editor="isEditor"
      :force-center="center"
      :force-zoom="zoom"
      :show-users="showUsers"
      :show-places="showPlaces"
      :show-groups="showGroups"
      @mapMoveEnd="mapMoveEnd"
      @toggleUsers="toggleUsers"
      @togglePlaces="togglePlaces"
      @toggleGroups="toggleGroups"
    />
  </div>
</template>

<script>

import GroupMap from '@/maps/components/GroupMap'

import { mapGetters, mapActions } from 'vuex'

import { throttle } from 'quasar'

export default {
  components: { GroupMap },
  computed: {
    ...mapGetters({
      places: 'places/byCurrentGroup',
      users: 'users/byCurrentGroup',
      groups: 'groups/all',
      currentGroup: 'currentGroup/value',
      isEditor: 'currentGroup/isEditor',
      showPlaces: 'sidenavBoxes/toggle/placesOnMap',
      showUsers: 'sidenavBoxes/toggle/usersOnMap',
      showGroups: 'sidenavBoxes/toggle/groupsOnMap',
    }),
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
    ...mapActions({
      togglePlaces: 'sidenavBoxes/toggle/placesOnMap',
      toggleUsers: 'sidenavBoxes/toggle/usersOnMap',
      toggleGroups: 'sidenavBoxes/toggle/groupsOnMap',
    }),
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

<style lang="stylus">
.map
  width 100%;
  height 100%

.placeholder
  position absolute
  top 0;
  left 0
  width 100%
  height 100%
</style>
