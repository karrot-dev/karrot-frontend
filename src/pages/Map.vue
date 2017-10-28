<template>
  <div>
    <div class="placeholder"/>
    <GroupMap class="map" :users="users" :stores="stores"/>
  </div>
</template>

<script>

import GroupMap from '@/components/Map/GroupMap.vue'

import { mapGetters } from 'vuex'

export default {
  components: { GroupMap },
  computed: {
    ...mapGetters({
      stores: 'stores/byActiveGroup',
      users: 'users/all',
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
