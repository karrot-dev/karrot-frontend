<template>
  <div class="placeholder">
    <GroupMap
      class="map"
      :users="users"
      :stores="stores"
      :current-group="currentGroup"
      @mapZoomed="mapZoomed"
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
  },
  data () {
    return {
      zoomLvl: null,
    }
  },
  methods: {
    mapZoomed (zoomLvl) {
      this.$router.replace({ query: {zoom: zoomLvl} })
      this.zoomLvl = Number(zoomLvl)
    },
  },
}
</script>

<style lang="stylus">
.map
  height 100%
  width 100%
.placeholder
  width: 100vw;
  height 100vh
  position: absolute;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
</style>
