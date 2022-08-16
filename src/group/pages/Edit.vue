<template>
  <GroupEdit
    :value="group"
    :timezones="timezones"
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
import { useCurrentGroupService } from '@/group/services'
import { useTimezonesQuery } from '@/group/queries'

const { timezones } = useTimezonesQuery()
const { myCoordinates } = useGeoService()

const {
  group,
} = useCurrentGroupService()
</script>
