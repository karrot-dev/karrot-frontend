import { Notify, Platform } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useAuthService } from '@/authuser/services'
import { useCommunityBannerService } from '@/communityFeed/services'
import { useCurrentGroupService } from '@/group/services'
import { defineService } from '@/utils/datastore/helpers'
import { useAboutService, useConnectivity } from '@/utils/services'

export const useBanners = defineService(() => {
  const route = useRoute()

  const { isPlayground } = useCurrentGroupService()
  const { isLoggedIn } = useAuthService()
  const {
    isConnected,
    reconnecting,
  } = useConnectivity()

  const isGroupPage = computed(() => Boolean(route.params.groupId))

  const { updateAvailable } = useAboutService()
  const { communityBanner } = useCommunityBannerService()

  return computed(() => {
    const banners = []

    if (updateAvailable.value && !Platform.is.cordova) {
      banners.push({
        type: 'updateAvailable',
      })
    }

    if (isLoggedIn.value && !isConnected.value) {
      banners.push({
        type: 'notConnected',
        desktopOnly: true,
        context: {
          reconnecting: reconnecting.value,
        },
      })
    }

    if (isGroupPage.value && isPlayground.value) {
      banners.push({
        type: 'playgroundGroupInfo',
        desktopOnly: true,
      })
    }

    if (communityBanner.value) {
      banners.push({
        type: 'communityBanner',
        context: communityBanner.value,
      })
    }

    return banners
  })
})

export const useToastService = defineService(() => {
  const { t } = useI18n()

  function showToast ({ message, messageParams, config }) {
    const defaultConfig = {
      icon: 'check_circle',
      color: 'positive',
      actions: [
        {
          icon: 'close',
          color: 'white',
          handler: () => {},
        },
      ],
    }

    Notify.create({
      ...defaultConfig,
      ...config,
      message: t(message, messageParams),
    })
  }

  return {
    showToast,
  }
})
