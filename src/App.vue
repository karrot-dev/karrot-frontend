<template>
  <!-- class root-splash is defined in index.html -->
  <img
    v-if="!hasView"
    class="root-splash root-splash-second"
    src="statics/carrot_logo.png"
  >
  <LoadingProgress />
  <RouterView />
</template>

<script>
/*
 * Root component
 */
import LoadingProgress from '@/topbar/components/LoadingProgress'

import { useClearDataOnLogout, useTitleStatus } from '@/utils/composables'
import { useOffersUpdater } from '@/offers/queries'
import { useActivitiesUpdater, useActivitySeriesUpdater, useActivityTypeUpdater } from '@/activities/queries'
import { useUsersUpdater } from '@/users/queries'
import { usePlacesUpdater } from '@/places/queries'
import { useStatusUpdater } from '@/status/queries'
import { useAuthUserUpdater } from '@/authuser/queries'
import { useConversationUpdater, useMessageUpdater } from '@/messages/queries'
import { usePerformance } from '@/boot/performance'
import { useGroupDetailUpdater } from '@/group/queries'
import { useGroupInfoUpdater } from '@/groupInfo/queries'
import { useApplicationsUpdater } from '@/applications/queries'
import { useNotificationsUpdater } from '@/notifications/queries'
import { useRoutingLogic, useCheckResponseAuthStatus } from '@/base/services'
import { onErrorCaptured } from 'vue'
import { useDetailService } from '@/messages/services'
import { useIssuesUpdater } from '@/issues/queries'
import { useQueryClient } from 'vue-query'
import { useWebsocket } from '@/base/services/websocket'

export default {
  components: {
    LoadingProgress,
  },
  setup () {
    useWebsocket()

    useRoutingLogic()
    useCheckResponseAuthStatus()

    // Websocket updaters
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

    // Utilities
    usePerformance()
    useTitleStatus()
    useClearDataOnLogout()
    const { installRouterPlugin } = useDetailService() // just to initialize it...
    installRouterPlugin()

    // This catches things that otherwise don't seem to be printed anywhere in the console
    // It doesn't stop the error propagating elsewhere, it's just seeing it, so nice and neutral
    onErrorCaptured(error => {
      console.error(error)
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
