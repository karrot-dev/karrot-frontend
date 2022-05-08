<template>
  <GroupEdit
    :value="$store.getters['currentGroup/value']"
    :timezones="$store.getters['timezones/autocompleteData']"
    :all-groups="$store.getters['groups/all']"
    :status="$store.getters['groups/saveStatus']"
    :default-map-center="$store.getters['geo/myCoordinates']"
    @save="data => $store.dispatch('groups/save', data)"
    @reset="id => $store.dispatch('groups/meta/clear', ['save', id])"
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
