import { computed } from 'vue'
import { defineService } from '@/utils/datastore/helpers'
import { useStore } from 'vuex'
import { useUserService } from '@/users/services'
import { usePlaceService } from '@/places/services'
import { useAuthService } from '@/authuser/services'

export const useCurrentGroupService = defineService(() => {
  // services
  const store = useStore()
  const {
    isLoading: isLoadingUsers,
    getUserById,
  } = useUserService()

  const {
    getPlacesByGroup,
    isLoading: isLoadingPlaces,
  } = usePlaceService()

  const { userId } = useAuthService()

  // computed
  // TODO: decouple from store
  // could come from route param, or auth user currentGroup field... also need to be able to set it...
  // TODO: move some of these things to helpers...
  const group = computed(() => store.state.currentGroup.current)
  const groupId = computed(() => group.value?.id)
  const users = computed(() => Object.keys(group.value.memberships).map(getUserById))
  const places = computed(() => getPlacesByGroup(groupId))
  const features = computed(() => group.value?.features || [])
  const theme = computed(() => group.value?.theme)
  const isGeneralPurpose = computed(() => theme.value === 'general')
  const isBikeKitchen = computed(() => theme.value === 'bikekitchen')
  const isEditor = computed(() => getIsEditor(userId.value))

  // methods

  function selectGroup ({ groupId }) {
    // TODO: decouple from store
    store.dispatch('currentGroup/select', { groupId })
  }

  // TODO: move some/all of these to membership helpers

  function getMembership (userId) {
    return group.value?.memberships[userId]
  }

  function getUserRoles (userId) {
    return getMembership(userId)?.roles || []
  }

  function getIsEditor (userId) {
    return getUserRoles(userId).includes('editor')
  }

  function getIsNewcomer (userId) {
    return !getIsEditor(userId)
  }

  return {
    selectGroup,
    group,
    groupId,
    isLoadingUsers,
    isLoadingPlaces,
    users,
    places,
    theme,
    isGeneralPurpose,
    isBikeKitchen,
    features,
    isEditor,
    getMembership,
    getUserRoles,
    getIsEditor,
    getIsNewcomer,
  }
})
