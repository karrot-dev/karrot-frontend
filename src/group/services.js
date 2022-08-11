import { computed, watch, ref, readonly } from 'vue'
import { defineService } from '@/utils/datastore/helpers'
import { useStore } from 'vuex'
import { useUserService } from '@/users/services'
import { usePlaceService } from '@/places/services'
import { useAuthService } from '@/authuser/services'
import { useIntegerRouteParam } from '@/utils/composables'
import { useGroupDetailQuery } from '@/group/queries'
import { useSaveUserMutation } from '@/authuser/mutations'

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

  const { userId, user } = useAuthService()
  const { mutate: saveUser } = useSaveUserMutation()

  const groupId = ref(null)

  // Do our best to ensure we have a group id set, if we don't have one, get it from the route, or current user
  const groupIdRouteParam = useIntegerRouteParam('groupId')

  // Set a default if we don't already have a groupid
  watch(groupId, value => {
    if (!value) {
      groupId.value = groupIdRouteParam.value || user.value?.currentGroup
    }
  }, { immediate: true })

  // When route changes we want to change
  watch(groupIdRouteParam, value => {
    if (value) {
      groupId.value = value
    }
  })

  // Trigger stuff when we set group id
  watch(groupId, value => {
    if (value) {
      // store.dispatch('currentGroup/select', { groupId: value })
      if (user.value && user.value.currentGroup !== value) {
        saveUser({ currentGroup: value })
      }
    }
  }, { immediate: true })

  const { group } = useGroupDetailQuery({ groupId })

  // Keep vuex updated
  watch(group, value => {
    // TODO: remove currentGroup vuex module :)
    store.commit('currentGroup/setId', value?.id)
    // We shallow clone the object, otherwise there are some errors with vue proxy stuff...
    // It's only temporary to do this, so seems fine for now!
    store.commit('currentGroup/set', value ? { ...value } : null)
  }, { immediate: true })

  // computed
  const users = computed(() => Object.keys(group.value.memberships).map(getUserById))
  const places = computed(() => getPlacesByGroup(groupId))
  const features = computed(() => group.value?.features || [])
  const theme = computed(() => group.value?.theme)
  const isGeneralPurpose = computed(() => theme.value === 'general')
  const isBikeKitchen = computed(() => theme.value === 'bikekitchen')
  const isEditor = computed(() => getIsEditor(userId.value))

  // methods

  function selectGroup (value) {
    groupId.value = value
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
    groupId: readonly(groupId),
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
