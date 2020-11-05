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
import { provideAuthUser, createUseAuthUser } from '@/activities/data/useAuthUser'
import { getCurrentInstance, watch } from '@vue/composition-api'
import { provideGlobalUsers, useUsers } from '@/activities/data/useUsers'
import { provideCurrentGroup, createCurrentGroup } from '@/activities/data/useCurrentGroup'
import { provideStatus, createStatus } from '@/activities/data/useStatus'
import { createCache, provideCache } from '@/activities/data/useCached'

export default {
  components: {
    LoadingProgress,
  },
  setup (props, { root }) {
    console.log('App setup')
    provideCache(createCache())
    const currentGroup = createCurrentGroup()
    const { setCurrentGroupId } = currentGroup
    const authUser = createUseAuthUser()
    const { setAuthUser, isLoggedIn } = authUser
    // "singletons"
    provideAuthUser(authUser)
    provideCurrentGroup(currentGroup)
    provideStatus(createStatus({ isLoggedIn }))
    // global
    provideGlobalUsers(useUsers())
    watch(() => root.$store.getters['auth/user'], user => setAuthUser(user), { immediate: true })
    watch(() => root.$store.getters['currentGroup/id'], id => setCurrentGroupId(id), { immediate: true })
  },
  computed: {
    hasView () {
      const firstMatched = this.$route.matched.length > 0 && this.$route.matched[0]
      if (!firstMatched) return
      return Boolean(firstMatched.components.default)
    },
  },
  methods: {
    rootfoo () {
      console.log('running root foo! current instance is', getCurrentInstance())
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
