<template>
  <div>
    <div class="placeholder"/>
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

<style scoped lang="stylus">
.map
  position absolute
  height 100vh
  width 100vw
  left 0
  top 0
.placeholder
  height 100vh
  width 100vw
</style>
