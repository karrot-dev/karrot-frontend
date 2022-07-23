import { computed } from 'vue'
import { defineService } from '@/utils/datastore/helpers'
import { useStore } from 'vuex'
import { useUserService } from '@/users/services'
import { usePlaceService } from '@/places/services'

export const useCurrentGroupService = defineService('group', () => {
  // services
  const store = useStore()
  const {
    isLoading: isLoadingUsers,
    getUserById,
  } = useUserService()
  const { getPlacesByGroup } = usePlaceService()

  // computed
  const group = computed(() => store.state.currentGroup.current)
  const groupId = computed(() => group.value?.id)
  const users = computed(() => Object.keys(group.value.memberships).map(getUserById))
  const places = computed(() => getPlacesByGroup(groupId))

  // methods

  function getMembership (userId) {
    return group.value?.memberships[userId]
  }

  function getUserRoles (userId) {
    return getMembership?.roles || []
  }

  function isEditor (userId) {
    return getUserRoles(userId).includes('editor')
  }

  function isNewcomer (userId) {
    return !isEditor(userId)
  }

  return {
    group,
    groupId,
    isLoadingUsers,
    users,
    places,
    getMembership,
    isEditor,
    isNewcomer,
  }
})
