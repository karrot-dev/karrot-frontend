<template>
  <div class="placeholder">
    <GroupMap
      class="map"
      :users="users"
      :stores="stores"
      :current-group="currentGroup"
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
}
</script>

<style lang="stylus">
.map
  height 100%
  width 100%
.placeholder
  position absolute
  height 100%
  width 100%
</style>
