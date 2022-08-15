<template>
  <GroupEdit
    :value="$store.getters['currentGroup/value']"
    :timezones="$store.getters['timezones/autocompleteData']"
    :all-groups="$store.getters['groups/all']"
    :status="$store.getters['groups/saveStatus']"
    :default-map-center="myCoordinates"
    @save="data => $store.dispatch('groups/save', data)"
    @reset="id => $store.dispatch('groups/meta/clear', ['save', id])"
  />
</template>

<script setup>
import GroupEdit from '@/group/components/GroupEdit'
import { useGeoService } from '@/base/services'

const { myCoordinates } = useGeoService()
</script>
