import { computed, watch, ref, readonly } from 'vue'
import { defineService } from '@/utils/datastore/helpers'
import { useStore } from 'vuex'
import { useUserService } from '@/users/services'
import { usePlaceService } from '@/places/services'
import { useAuthService } from '@/authuser/services'
import { useIntegerRouteParam } from '@/utils/composables'
import { useGroupDetailQuery } from '@/group/queries'
import { useSaveUserMutation } from '@/authuser/mutations'
import { useRouter } from 'vue-router'
import * as Sentry from '@sentry/vue'
import groups from '@/group/api/groups'
import { messages as loadMessages } from '@/locales'
import { extend } from 'quasar'
import i18n from '@/base/i18n'

export const useCurrentGroupService = defineService(() => {
  // services
  const {
    isLoading: isLoadingUsers,
    getUserById,
  } = useUserService()

  const { userId } = useAuthService()

  const {
    getPlacesByGroup,
    isLoading: isLoadingPlaces,
  } = usePlaceService()

  const {
    groupId,
    selectGroup,
  } = useCurrentGroupId()

  const {
    group,
    isLoading: isLoadingGroup,
    wait: waitForGroupToLoad,
  } = useGroupDetailQuery({ groupId })

  // computed
  const users = computed(() => Object.keys(group.value?.memberships || {}).map(getUserById))
  const places = computed(() => getPlacesByGroup(groupId))
  const features = computed(() => group.value?.features || [])
  const theme = computed(() => group.value?.theme)
  const isPlayground = computed(() => group.value?.status === 'playground')
  const isGeneralPurpose = computed(() => theme.value === 'general')
  const isBikeKitchen = computed(() => theme.value === 'bikekitchen')
  const isEditor = computed(() => getIsEditor(userId.value))

  // methods

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

  // Things that might be triggered on changes

  // keep users current group saved
  useSaveUserCurrentGroup({ groupId })

  // keep set locale messages based on theme
  useLocaleMessagesSetter({ isBikeKitchen, isGeneralPurpose })

  // mark user active
  useMarkUserActive({ groupId })

  // Keep vuex updated
  useStoreUpdater({ group })

  return {
    selectGroup,
    group,
    groupId: readonly(groupId),
    waitForGroupToLoad,
    isLoadingGroup,
    isLoadingUsers,
    isLoadingPlaces,
    users,
    places,
    theme,
    isPlayground,
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

function useCurrentGroupId () {
  const {
    user,
    isLoggedIn,
  } = useAuthService()

  const groupId = ref(null)

  // Do our best to ensure we have a group id set, if we don't have one, get it from the route, or current user
  const groupIdRouteParam = useIntegerRouteParam('groupId')

  // Set a default if we don't already have a groupid
  watch(groupId, value => {
    if (!value && isLoggedIn.value) {
      groupId.value = groupIdRouteParam.value || user.value?.currentGroup
    }
  }, { immediate: true })

  // When route changes we want to change
  watch(groupIdRouteParam, value => {
    if (value) {
      groupId.value = value
    }
  })

  watch(isLoggedIn, value => {
    if (value) {
      // when use the current group if we don't have it already
      if (!groupId.value) {
        groupId.value = user.value.currentGroup
      }
    }
    else {
      // When logging out, reset it
      groupId.value = null
    }
  })

  function selectGroup (value) {
    groupId.value = value
  }

  return {
    groupId: readonly(groupId),
    selectGroup,
  }
}

function useLocaleMessagesSetter ({ isBikeKitchen, isGeneralPurpose }) {
  const store = useStore()

  // TODO: decouple from store
  const locale = computed(() => store.getters['i18n/locale'])
  const useGeneralPurposeMessages = computed(() => isBikeKitchen.value || isGeneralPurpose.value)

  watch(
    () => [useGeneralPurposeMessages.value, locale.value],
    async () => {
      if (!locale.value) return
      if (useGeneralPurposeMessages.value) {
        const generalPurposeMessages = await import('@/locales/generalPurpose.json')
        const messages = await loadMessages(locale.value)
        if (!useGeneralPurposeMessages.value) return
        const mergedMessages = extend(true, {}, messages, generalPurposeMessages)
        i18n.setLocaleMessage(locale.value, mergedMessages)
      }
      else {
        const messages = await loadMessages(locale.value)
        if (useGeneralPurposeMessages.value) return

        i18n.setLocaleMessage(locale.value, messages)
      }
    },
    {
      immediate: true,
    },
  )
}

function useMarkUserActive ({ groupId }) {
  const router = useRouter()
  router.afterEach(async () => {
    try {
      /**
       * Marks the user as active in the current group
       * Should only be triggered when the user visits a group page
       * It currently also gets triggered when the user visits the profile page, but that seems fine.
       */
      if (groupId.value) await groups.throttledMarkUserActive(groupId.value)
    }
    catch (err) {
      Sentry.captureException(err)
    }
  })
}

function useStoreUpdater ({ group }) {
  const store = useStore()
  watch(group, value => {
    // TODO: remove currentGroup vuex module :)
    store.commit('currentGroup/setId', value?.id)
    // We shallow clone the object, otherwise there are some errors with vue proxy stuff...
    // It's only temporary to do this, so seems fine for now!
    store.commit('currentGroup/set', value ? { ...value } : null)
  }, { immediate: true })
}

function useSaveUserCurrentGroup ({ groupId }) {
  const { user } = useAuthService()
  const { mutate: saveUser } = useSaveUserMutation()
  // Trigger stuff when we set group id
  watch(groupId, value => {
    if (value) {
      if (user.value && user.value.currentGroup !== value) {
        saveUser({ currentGroup: value })
      }
    }
  }, { immediate: true })
}
