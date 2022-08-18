<template>
  <GroupEdit
    :timezones="timezones"
    :all-groups="groups"
    :status="createStatus"
    :default-map-center="myCoordinates"
    @save="group => create(group)"
    @reset="reset"
  />
</template>

<script setup>
import GroupEdit from '@/group/components/GroupEdit'
import { useGeoService } from '@/base/services'
import { useTimezonesQuery } from '@/group/queries'
import { useCreateGroupMutation } from '@/group/mutations'
import { useGroupInfoService } from '@/groupInfo/services'

const { timezones } = useTimezonesQuery()
const { myCoordinates } = useGeoService()
const { groups } = useGroupInfoService()
const {
  mutate: create,
  status: createStatus,
  reset,
} = useCreateGroupMutation()
</script>
