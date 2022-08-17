import { computed, watch } from 'vue'

import { defineService, indexById } from '@/utils/datastore/helpers'
import { useGroupInfoListQuery } from '@/groupInfo/queries'
import { useQueryClient } from 'vue-query'
import { queryKeyPlaceListAll } from '@/places/queries'
import { useIntegerRouteParam } from '@/utils/composables'

export const useGroupInfoService = defineService(() => {
  // services
  const queryClient = useQueryClient()

  // queries
  // TODO: should we filter for active groups? there are loads of dead/empty groups..? maybe hide ones with no users on server?
  const {
    groups,
    isLoading: isLoadingGroups,
  } = useGroupInfoListQuery()

  // includes playground status...
  const activeGroups = computed(() => groups.value.filter(group => group.status !== 'inactive'))

  // computed
  const groupsById = computed(() => indexById(groups.value))

  // We keep the place list up to date across all groups, so when our available groups changes, we need to invalidate our list of places too
  // It's stored as a comma separated string of group ids, so it doesn't change just because something else in the group changed
  // TODO: check this works!
  watch(
    () => groups.value
      .filter(group => group.isMember)
      .map(group => group.id)
      .sort((a, b) => a - b)
      .join(','),
    (val) => {
      console.log('groups changed!', val, 'invalidating places')
      queryClient.invalidateQueries(queryKeyPlaceListAll())
    },
  )

  // methods
  function getGroupById (id) {
    return groupsById.value[id]
  }

  return {
    groups,
    isLoadingGroups,
    activeGroups,
    getGroupById,
  }
})

export const useActiveGroupPreviewService = defineService(() => {
  const groupId = useIntegerRouteParam('groupPreviewId')

  const { getGroupById } = useGroupInfoService()

  const group = computed(() => getGroupById(groupId.value))

  return {
    groupId,
    group,
  }
})
