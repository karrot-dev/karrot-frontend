<template>
  <GroupMap
    v-if="currentGroup"
    class="map"
    controls="mini"
    :height="260"
    :stores="stores"
    :users="users"
    :show-users="showUsers"
    :show-stores="showStores"
    :selected-store="selectedStore"
    :selected-user="selectedUser"
    :current-group="currentGroup"
    @toggleUsers="$emit('toggleUsers')"
    @toggleStores="$emit('toggleStores')"
  />
</template>

<script>
import GroupMap from '@/maps/components/GroupMap'

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
    selectedUser: {
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
