import { computed, unref, watch } from 'vue'

import { useActivityTypeListQuery, usePublicActivityItemQuery } from '@/activities/queries'
import { createActivityTypeStylesheet } from '@/activities/stylesheet'
import { useAuthService } from '@/authuser/services'
import { useRouteParam } from '@/utils/composables'
import { defineService, indexById } from '@/utils/datastore/helpers'

export const useActivityTypeService = defineService(() => {
  const { isLoggedIn } = useAuthService()

  // queries
  const { activityTypes } = useActivityTypeListQuery({ enabled: isLoggedIn })

  // computed
  const activityTypesById = computed(() => indexById(activityTypes.value))

  // utils
  const { updateEntries } = createActivityTypeStylesheet()
  watch(activityTypes, updateEntries, { immediate: true })

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

export const useActivePublicActivityService = defineService(() => {
  const activityPublicId = useRouteParam('activityPublicId')
  const { publicActivity } = usePublicActivityItemQuery({ activityPublicId })
  return {
    publicActivity,
  }
})
