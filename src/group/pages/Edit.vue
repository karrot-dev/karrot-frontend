<template>
  <GroupEdit
    :value="group"
    :timezones="timezones"
    :all-groups="groups"
    :status="saveStatus"
    :default-map-center="myCoordinates"
    @save="data => save(data)"
    @reset="reset"
  />
</template>

<script setup>
import { useGeoService } from '@/base/services/geo'
import { useSaveGroupMutation } from '@/group/mutations'
import { useTimezonesQuery } from '@/group/queries'
import { useCurrentGroupService } from '@/group/services'
import { useGroupInfoService } from '@/groupInfo/services'

import GroupEdit from '@/group/components/GroupEdit'

const { timezones } = useTimezonesQuery()
const { myCoordinates } = useGeoService()
const { groups } = useGroupInfoService()

const {
  group,
} = useCurrentGroupService()

const {
  mutate: save,
  status: saveStatus,
  reset,
} = useSaveGroupMutation()
</script>
