<template>
  <GroupMap
    class="map"
    controls="mini"
    :height="260"
    :places="places"
    :users="users"
    :show-users="showUsers"
    :show-places="showPlaces"
    :selected-place="selectedPlace"
    :selected-user="selectedUser"
    :current-group="currentGroup"
    :is-editor="isEditor"
    @toggleUsers="$emit('toggleUsers')"
    @togglePlaces="$emit('togglePlaces')"
  />
</template>

<script>
import GroupMap from '@/maps/components/GroupMap'

export default {
  components: { GroupMap },
  props: {
    places: {
      default: () => [],
      type: Array,
    },
    users: {
      default: () => [],
      type: Array,
    },
    selectedPlace: {
      default: null,
      type: Object,
    },
    selectedUser: {
      default: null,
      type: Object,
    },
    showPlaces: {
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
    isEditor: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
