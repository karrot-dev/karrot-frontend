<template>
  <GroupEdit
    :timezones="timezones"
    :all-groups="$store.getters['groups/all']"
    :status="$store.getters['groups/createStatus']"
    :default-map-center="myCoordinates"
    @save="data => $store.dispatch('groups/create', data)"
    @reset="$store.dispatch('groups/meta/clear', ['create'])"
  />
</template>

<script setup>
import GroupEdit from '@/group/components/GroupEdit'
import { useGeoService } from '@/base/services'
import { useTimezonesQuery } from '@/group/queries'

const { timezones } = useTimezonesQuery()
const { myCoordinates } = useGeoService()
</script>
