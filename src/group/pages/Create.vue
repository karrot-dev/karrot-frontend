<template>
  <GroupEdit
    :timezones="$store.getters['timezones/autocompleteData']"
    :all-groups="$store.getters['groups/all']"
    :status="$store.getters['groups/createStatus']"
    :default-map-center="$store.getters['geo/myCoordinates']"
    @save="data => $store.dispatch('groups/create', data)"
    @reset="$store.dispatch('groups/meta/clear', ['create'])"
  />
</template>

<script>
import GroupEdit from '@/group/components/GroupEdit'

export default {
  components: {
    GroupEdit,
  },
}
</script>
