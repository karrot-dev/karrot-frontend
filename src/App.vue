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

export default {
  components: {
    LoadingProgress,
  },
  setup () {
    // Websocket updaters
    useAuthUserUpdater()
    useUsersUpdater()
    usePlacesUpdater()
    useOffersUpdater()
    useStatusUpdater()
    useActivitiesUpdater()
    useActivitySeriesUpdater()
    useActivityTypeUpdater()
    useConversationUpdater()
    useMessageUpdater()

    // Utilities
    usePerformance()
    useTitleStatus()
    useClearDataOnLogout()
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
