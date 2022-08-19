import { computed, unref, watch } from 'vue'

import { useActivityTypeListQuery } from '@/activities/queries'
import { createActivityTypeStylesheet } from '@/activities/stylesheet'
import { defineService, indexById } from '@/utils/datastore/helpers'

export const useActivityTypeService = defineService(() => {
  // queries
  const { activityTypes } = useActivityTypeListQuery()

  // computed
  const activityTypesById = computed(() => indexById(activityTypes.value))

  // utils
  const { updateActivityTypes } = createActivityTypeStylesheet()
  watch(activityTypes, updateActivityTypes, { immediate: true })

  // methods
  function getActivityTypeById (id) {
    return activityTypesById.value[id]
  }

  function getActivityTypesByGroup (groupId, filters = {}) {
    const entries = activityTypes.value.filter(entry => entry.group === unref(groupId))
    return filters.status ? entries.filter(entry => entry.status === unref(filters.status)) : entries
  }

  return {
    activityTypes,
    getActivityTypeById,
    getActivityTypesByGroup,
  }
})
