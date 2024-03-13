import { extend } from 'quasar'
import { computed, watch, ref, readonly, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { useSaveUserMutation } from '@/authuser/mutations'
import { useAuthService } from '@/authuser/services'
import i18n from '@/base/i18n'
import { useI18nService } from '@/base/services/i18n'
import groups from '@/group/api/groups'
import { useGroupDetailQuery } from '@/group/queries'
import { useGroupInfoService } from '@/groupInfo/services'
import { messages as loadMessages } from '@/locales'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'
import { useIntegerRouteParam } from '@/utils/composables'
import { defineService } from '@/utils/datastore/helpers'
import { captureException } from '@/utils/errors'

export const useCurrentGroupService = defineService(() => {
  // services
  const router = useRouter()
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
    clearGroup,
  } = useCurrentGroupId()

  const { groups } = useGroupInfoService()

  const {
    group,
    isLoading: isLoadingGroup,
    wait: waitForGroupToLoad,
  } = useGroupDetailQuery({ groupId }, {
    onError (error) {
      if (error?.response?.status === 404) { // TODO: could do for other errors too?
        // Not found! (only groups we are members of can be found) .. but it might exist for preview
        const groupPreview = groups.value.find(group => group.id === groupId.value)
        if (groupPreview) {
          router.push({ name: 'groupPreview', params: { groupPreviewId: groupPreview.id } })
        }
        else {
          router.push({ name: 'groupsGallery' })
        }
      }
    },
  })

  // computed
  const users = computed(() => Object.keys(group.value?.memberships || {}).map(getUserById))
  const places = computed(() => getPlacesByGroup(groupId)
    .sort(sortByName))
  const features = computed(() => group.value?.features || [])
  const theme = computed(() => group.value?.theme)
  const isPlayground = computed(() => group.value?.status === 'playground')
  const isGeneralPurpose = computed(() => theme.value === 'general')
  const isBikeKitchen = computed(() => theme.value === 'bikekitchen')
  const isEditor = computed(() => getIsEditor(userId.value))
  // TODO overlaps with group.roles, maybe rename to authUserRoles?
  const roles = computed(() => getUserRoles(userId.value))

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

  // keep locale updated
  useSaveUserCurrentLocale()

  // keep set locale messages based on theme
  useLocaleMessagesSetter({ isBikeKitchen, isGeneralPurpose })

  // mark user active
  useMarkUserActive({ groupId })

  return {
    selectGroup,
    clearGroup,
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
    roles,
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

  watchEffect(() => {
    if (isLoggedIn.value) {
      // Route param takes priority
      if (groupIdRouteParam.value) {
        groupId.value = groupIdRouteParam.value
      }
      // Otherwise if we don't have a group set already, use the user default
      if (!groupId.value) {
        groupId.value = user.value?.currentGroup
      }
    }
    else {
      groupId.value = null
    }
  })

  function selectGroup (value) {
    groupId.value = value
  }

  function clearGroup () {
    groupId.value = null
  }

  return {
    groupId: readonly(groupId),
    selectGroup,
    clearGroup,
  }
}

// TODO: this probably belongs in the i18nService ...
function useLocaleMessagesSetter ({ isBikeKitchen, isGeneralPurpose }) {
  const { locale } = useI18nService()
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
        i18n.setLocaleMessage(locale.value, mergedMessages.default || mergedMessages)
      }
      else {
        const messages = await loadMessages(locale.value)
        if (useGeneralPurposeMessages.value) return

        i18n.setLocaleMessage(locale.value, messages.default || messages)
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
      captureException(err)
    }
  })
}

function useSaveUserCurrentGroup ({ groupId }) {
  const { user } = useAuthService()
  const { mutate: saveUser } = useSaveUserMutation()
  watch(groupId, value => {
    if (value) {
      if (user.value && user.value.currentGroup !== value) {
        saveUser({ currentGroup: value })
      }
    }
  }, { immediate: true })
}

function useSaveUserCurrentLocale () {
  const { user } = useAuthService()
  const { mutate: saveUser } = useSaveUserMutation()
  const { locale } = useI18nService()
  watch(locale, value => {
    if (value && user.value && user.value.language !== value) {
      saveUser({ language: value })
    }
  }, { immediate: true })
}

// TODO: move somewhere better
export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}

export function useHasFeature (featureName) {
  const { features } = useCurrentGroupService()
  return computed(() => features.value?.includes(featureName))
}
