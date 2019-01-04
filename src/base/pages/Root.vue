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
export default {
  components: {
    LoadingProgress,
  },
  computed: {
    hasView () {
      const firstMatched = this.$route.matched.length > 0 && this.$route.matched[0]
      if (!firstMatched) return
      return Boolean(firstMatched.components['default'])
    },
  },
}
</script>

<style lang="stylus" scoped>
.root-splash-second
  animation fadein 2s
  opacity 1
@keyframes fadein
  from
    opacity 0.3
  to
    opacity 1
</style>
