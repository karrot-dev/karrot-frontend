<template>
  <!-- Don't drop "q-app" id -->

  <div id="q-app">
    <!-- class root-splash is defined in index.html -->
    <img
      v-if="!hasView"
      class="root-splash root-splash-second"
      src="statics/carrot_logo.png"
    >
    <LoadingProgress />
    <RouterView />
  </div>
</template>

<script>
/*
 * Root component
 */
import LoadingProgress from '@/topbar/components/LoadingProgress'
import { provideGlobalActivities, useActivities } from '@/activities/data/use-activities'
import { provideGlobalAuthUser, useAuthUser } from '@/activities/data/useAuthUser'
import { watch } from '@vue/composition-api'
import { provideGlobalUsers, useUsers } from '@/activities/data/use-users'
import { useCurrentGroup } from '@/activities/data/useCurrentGroup'

export default {
  components: {
    LoadingProgress,
  },
  setup (props, { root }) {
    const { currentGroupId, setCurrentGroupId } = useCurrentGroup()
    const authUser = useAuthUser()
    const { setAuthUserId } = authUser
    provideGlobalAuthUser(authUser)
    provideGlobalUsers(useUsers())
    provideGlobalActivities(useActivities({ groupId: currentGroupId }))
    watch(() => root.$store.getters['auth/userId'], id => setAuthUserId(id), { immediate: true })
    watch(() => root.$store.getters['currentGroup/id'], id => setCurrentGroupId(id), { immediate: true })
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

<style lang="stylus" scoped>
#q-app
  // this is to prevent the "oversize" image on the landing page
  // from creating a horizontal scrollbar
  overflow-x hidden

.root-splash-second
  opacity 1
  animation fadein 2s
@keyframes fadein
  from
    opacity 0.3

  to
    opacity 1
</style>
