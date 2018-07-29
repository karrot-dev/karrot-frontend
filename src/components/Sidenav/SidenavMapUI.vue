<template>
  <GroupMap
    v-if="currentGroup"
    class="map"
    controls="mini"
    :stores="stores"
    :users="users"
    :show-users="showUsers"
    :show-stores="showStores"
    :selected-store="selectedStore"
    :current-group="currentGroup"
    @toggleUsers="$emit('toggleUsers')"
    @toggleStores="$emit('toggleStores')"
  />
</template>

<script>
import GroupMap from '@/components/Map/GroupMap'

export default {
  components: { GroupMap },
  props: {
    stores: {
      default: () => [],
      type: Array,
    },
    users: {
      default: () => [],
      type: Array,
    },
    selectedStore: {
      default: null,
      type: Object,
    },
    showStores: {
      default: true,
      type: Boolean,
    },
    showUsers: {
      default: true,
      type: Boolean,
    },
    currentGroup: {
      default: null,
      type: Object,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.map
  height: 260px
</style>
