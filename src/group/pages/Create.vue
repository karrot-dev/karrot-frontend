<template>
  <GroupEdit
    :timezones="timezones"
    :all-groups="groups"
    :status="createStatus"
    :default-map-center="myCoordinates"
    @save="data => create(data)"
    @reset="reset"
  />
</template>

<script setup>
import { useGeoService } from '@/base/services/geo'
import { useCreateGroupMutation } from '@/group/mutations'
import { useTimezonesQuery } from '@/group/queries'
import { useGroupInfoService } from '@/groupInfo/services'

import GroupEdit from '@/group/components/GroupEdit'

const { timezones } = useTimezonesQuery()
const { myCoordinates } = useGeoService()
const { groups } = useGroupInfoService()
const {
  mutate: create,
  status: createStatus,
  reset,
} = useCreateGroupMutation()
</script>
