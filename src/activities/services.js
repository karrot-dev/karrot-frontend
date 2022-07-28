import { computed, unref } from 'vue'
import { useActivityTypeListQuery } from '@/activities/queries'
import { defineService, indexById } from '@/utils/datastore/helpers'

export const useActivityService = defineService(() => {
  // queries
  const { activityTypes } = useActivityTypeListQuery()

  // computed
  const activityTypesById = computed(() => indexById(activityTypes.value))

  // methods
  function getActivityTypeById (id) {
    return activityTypesById.value[id]
  }

  function getActivityTypesByGroup (groupId) {
    return activityTypes.value.filter(entry => entry.group === unref(groupId))
  }

  return {
    activityTypes,
    getActivityTypeById,
    getActivityTypesByGroup,
  }
})
