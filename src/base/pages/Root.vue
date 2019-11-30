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
import { measure, measureMixin } from '@/utils/performance'

export default {
  components: {
    LoadingProgress,
  },
  mixins: [measureMixin('Root')],
  computed: {
    hasView () {
      const firstMatched = this.$route.matched.length > 0 && this.$route.matched[0]
      if (!firstMatched) return
      return Boolean(firstMatched.components.default)
    },
  },
  watch: {
    hasView (val) {
      if (val) measure('Root', 'hasView')
    },
  },
}
</script>

<style lang="stylus" scoped>
.root-splash-second
  opacity 1
  animation fadein 2s
@keyframes fadein
  from
    opacity 0.3

  to
    opacity 1
</style>
