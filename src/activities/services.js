import { computed, unref, watch } from 'vue'
import { useActivityTypeListQuery } from '@/activities/queries'
import { defineService, indexById } from '@/utils/datastore/helpers'
import reactiveNow from '@/utils/reactiveNow'
import { createActivityTypeStylesheet } from '@/activities/datastore/activityTypeStylesheetPlugin'

export const useActivityService = defineService(() => {
  // queries
  const { activityTypes } = useActivityTypeListQuery()

  // computed
  const activityTypesById = computed(() => indexById(activityTypes.value))

  // utils
  const { updateActivityTypes } = createActivityTypeStylesheet()
  watch(activityTypes, updateActivityTypes)

  // methods
  function getActivityTypeById (id) {
    return activityTypesById.value[id]
  }

  function getActivityTypesByGroup (groupId, filters = {}) {
    const entries = activityTypes.value.filter(entry => entry.group === unref(groupId))
    return filters.status ? entries.filter(entry => entry.status === unref(filters.status)) : entries
  }

  function isStartedOrUpcoming (activity) {
    return activity.dateEnd > reactiveNow.value
  }

  return {
    activityTypes,
    getActivityTypeById,
    getActivityTypesByGroup,
    isStartedOrUpcoming,
  }
})
