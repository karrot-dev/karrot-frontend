import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import { Notify, Platform } from 'quasar'

import { defineService } from '@/utils/datastore/helpers'
import { useCurrentGroupService } from '@/group/services'
import { useAuthService } from '@/authuser/services'
import { useI18n } from 'vue-i18n'
import { useCommunityBannerService } from '@/communityFeed/services'

export const useBanners = defineService(() => {
  const route = useRoute()
  const store = useStore()

  const { isPlayground } = useCurrentGroupService()
  const { isLoggedIn } = useAuthService()

  const isGroupPage = computed(() => Boolean(route.params.groupId))

  // TODO: decouple from store
  const connected = computed(() => store.getters['connectivity/connected'])
  const reconnecting = computed(() => store.getters['connectivity/reconnecting'])
  const updateAvailable = computed(() => store.getters['about/updateAvailable'])

  const { communityBanner } = useCommunityBannerService()

  return computed(() => {
    const banners = []

    if (updateAvailable.value && !Platform.is.cordova) {
      banners.push({
        type: 'updateAvailable',
      })
    }

    if (isLoggedIn.value && !connected.value) {
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
