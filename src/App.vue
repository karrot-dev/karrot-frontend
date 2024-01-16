<template>
  <!-- class root-splash is defined in index.html -->
  <img
    v-if="!hasView"
    class="root-splash root-splash-second"
    src="statics/carrot_logo.png"
  >
  <LoadingProgress />
  <RouterView />
  <SvgFilters />
</template>

<script>
/*
 * Root component
 */

import { useQueryClient } from '@tanstack/vue-query'
import { onErrorCaptured } from 'vue'

import { useActivitiesUpdater, useActivitySeriesUpdater, useActivityTypeUpdater } from '@/activities/queries'
import { useAgreementsUpdater } from '@/agreements/queries'
import { useApplicationsUpdater } from '@/applications/queries'
import { useAuthUserUpdater } from '@/authuser/queries'
import { useRoutingLogic, useCheckResponseAuthStatus } from '@/base/services'
import { useWebsocket } from '@/base/services/websocket'
import { usePerformance } from '@/boot/performance'
import { useGroupDetailUpdater } from '@/group/queries'
import { useGroupInfoUpdater } from '@/groupInfo/queries'
import { useIssuesUpdater } from '@/issues/queries'
import { useRoomListUpdater } from '@/meet/queries'
import { useConversationUpdater, useMessageUpdater } from '@/messages/queries'
import { useDetailService } from '@/messages/services'
import { useNotificationsUpdater } from '@/notifications/queries'
import { useOffersUpdater } from '@/offers/queries'
import { usePlacesUpdater } from '@/places/queries'
import { useStatusUpdater } from '@/status/queries'
import { useUsersUpdater } from '@/users/queries'
import { useClearDataOnLogout, useTitleStatus } from '@/utils/composables'
import { showToast } from '@/utils/toasts'

import LoadingProgress from '@/topbar/components/LoadingProgress.vue'
import SvgFilters from '@/utils/components/SvgFilters.vue'

export default {
  components: {
    SvgFilters,
    LoadingProgress,
  },
  setup () {
    if (import.meta.env.MODE === 'cordova') {
      // Only load the dependencies if actually in cordova mode
      const { useCordova } = require('@/utils/cordova')
      useCordova()
    }
    useWebsocket()

    useRoutingLogic()
    useCheckResponseAuthStatus()

    // Websocket updaters
    useAgreementsUpdater()
    useAuthUserUpdater()
    useApplicationsUpdater()
    useUsersUpdater()
    usePlacesUpdater()
    useOffersUpdater()
    useStatusUpdater()
    useActivitiesUpdater()
    useActivitySeriesUpdater()
    useActivityTypeUpdater()
    useConversationUpdater()
    useMessageUpdater()
    useGroupInfoUpdater()
    useGroupDetailUpdater()
    useNotificationsUpdater()
    useIssuesUpdater()
    useRoomListUpdater()

    // Utilities
    usePerformance()
    useTitleStatus()
    useClearDataOnLogout()
    useDetailService() // needs to be initialized as it uses router hooks

    // This catches things that otherwise don't seem to be printed anywhere in the console
    // It doesn't stop the error propagating elsewhere, it's just seeing it, so nice and neutral
    onErrorCaptured(error => {
      console.error(error)
      showToast({
        message: error.message,
        config: {
          icon: 'priority_high',
          color: 'warning',
        },
      })
    })

    // TODO: remove at some point... just trying it out for now
    window.queryClient = useQueryClient()
  },
  computed: {
    hasView () {
      const firstMatched = this.$route.matched.length > 0 && this.$route.matched[0]
      if (!firstMatched) return
      return Boolean(firstMatched.components.default)
    },
  },
  mounted () {
    const el = document.querySelector('.root-splash-first')
    if (el) el.remove()
  },
}
</script>

<style lang="sass" scoped>
.root-splash-second
  opacity: 1
  animation: fadein 2s
@keyframes fadein
  from
    opacity: 0.3

  to
    opacity: 1
</style>
