<template>
  <div class="placeholder">
    <GroupMap
      class="map"
      :users="users"
      :stores="stores"
      :groups="groups"
      :current-group="currentGroup"
      :force-center="center"
      :force-zoom="zoom"
      :show-users="showUsers"
      :show-stores="showStores"
      :show-groups="showGroups"
      controls="full"
      @mapMoveEnd="mapMoveEnd"
      @toggleUsers="toggleUsers"
      @toggleStores="toggleStores"
      @toggleGroups="toggleGroups"
    />
  </div>
</template>

<script>

import GroupMap from '@/components/Map/GroupMap'

import { mapGetters, mapActions } from 'vuex'

export default {
  components: { GroupMap },
  computed: {
    ...mapGetters({
      stores: 'stores/byCurrentGroup',
      users: 'users/byCurrentGroup',
      groups: 'groups/all',
      currentGroup: 'currentGroup/value',
      showStores: 'sidenavBoxes/toggle/storesOnMap',
      showUsers: 'sidenavBoxes/toggle/usersOnMap',
      showGroups: 'sidenavBoxes/toggle/groupsOnMap',
    }),
    center () {
      return {lat: Number(this.$route.query.lat), lng: Number(this.$route.query.lng)}
    },
    zoom () {
      return Number(this.$route.query.zoom)
    },
  },
  methods: {
    ...mapActions({
      toggleStores: 'sidenavBoxes/toggle/storesOnMap',
      toggleUsers: 'sidenavBoxes/toggle/usersOnMap',
      toggleGroups: 'sidenavBoxes/toggle/groupsOnMap',
    }),
    mapMoveEnd (target) {
      this.$router.replace({query: {lat: target.getCenter().lat, lng: target.getCenter().lng, zoom: target.getZoom()}})
    },
  },
}
</script>

<style lang="stylus">
.map
  height 100%
  width 100%
.placeholder
  height calc(100% - 50px)
  width 100%
  position absolute
  left 0
  top 50px
</style>
