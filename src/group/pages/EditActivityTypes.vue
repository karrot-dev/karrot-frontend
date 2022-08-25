<template>
  <EditActivityTypesUI :activity-types="activityTypes" />
</template>

<script setup>
import { computed } from 'vue'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { useCurrentGroupService } from '@/group/services'

import EditActivityTypesUI from '@/group/components/EditActivityTypesUI'

const { groupId } = useCurrentGroupService()
const { getActivityTypesByGroup } = useActivityTypeService()
const { getTranslatedName } = useActivityTypeHelpers()

function sortByTranslatedName (a, b) {
  return getTranslatedName(a).localeCompare(getTranslatedName(b))
}

const activityTypes = computed(() => getActivityTypesByGroup(groupId.value)
  .sort(sortByTranslatedName))
</script>
