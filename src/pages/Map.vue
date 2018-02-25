<template>
  <div class="placeholder">
    <GroupMap
      class="map"
      :users="users"
      :stores="stores"
      :current-group="currentGroup"
      :force-center="center"
      :force-zoom="zoom"
      @mapMoveEnd="mapMoveEnd"
    />
  </div>
</template>

<script>

import GroupMap from '@/components/Map/GroupMap'

import { mapGetters } from 'vuex'

export default {
  components: { GroupMap },
  computed: {
    ...mapGetters({
      stores: 'stores/byCurrentGroup',
      users: 'users/byCurrentGroup',
      currentGroup: 'currentGroup/value',
    }),
    center () {
      return {lat: Number(this.$route.query.lat), lng: Number(this.$route.query.lng)}
    },
    zoom () {
      return Number(this.$route.query.zoom)
    },
  },
  methods: {
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
  width 100vw
  height 100vh
  position absolute
  left 50%
  right 50%
  margin-left -50vw
  margin-right -50vw
</style>
