<template>
  <EditActivityTypesUI
    :activity-types="activityTypes"
    :activity-type-save-status="saveStatus"
    :activity-type-create-status="createStatus"
    @create="activityType => create(activityType)"
    @save="activityType => save(activityType)"
  />
</template>

<script setup>
import { computed } from 'vue'

import { useCreateActivityTypeMutation, useSaveActivityTypeMutation } from '@/activities/mutations'
import { useActivityTypeService } from '@/activities/services'
import { useCurrentGroupService } from '@/group/services'

import EditActivityTypesUI from '@/group/components/EditActivityTypesUI'

const { groupId } = useCurrentGroupService()
const { getActivityTypesByGroup } = useActivityTypeService()

const activityTypes = computed(() => getActivityTypesByGroup(groupId.value))

const {
  mutate: create,
  status: createStatus,
} = useCreateActivityTypeMutation({ groupId })

const {
  mutate: save,
  status: saveStatus,
} = useSaveActivityTypeMutation()

</script>
