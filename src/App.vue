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
import { provideGlobalFoo, useFoo } from '@/activities/data/use-foo'

export default {
  components: {
    LoadingProgress,
  },
  setup () {
    console.log('App setup!')
    const foo = useFoo()
    provideGlobalFoo(foo)
    const { groupId, setGroupId } = foo
    provideGlobalActivities(useActivities({ groupId }))
    return {
      setGroupId,
    }
  },
  computed: {
    hasView () {
      const firstMatched = this.$route.matched.length > 0 && this.$route.matched[0]
      if (!firstMatched) return
      return Boolean(firstMatched.components.default)
    },
  },
  watch: {
    // TODO: in next version of vue router there is composition-api hooks
    //  see https://next.router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup
    '$route.params.groupId': {
      handler (groupId) {
        console.log('setting group id to', groupId)
        this.setGroupId(groupId)
      },
      immediate: true,
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
