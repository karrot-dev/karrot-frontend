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
  const places = computed(() => {
    try {
      return getPlacesByGroup(groupId)
    }
    catch (error) {
      console.error(error)
      return []
    }
  })

  return {
    group,
    groupId,
    isLoadingUsers,
    users,
    places,
  }
})
