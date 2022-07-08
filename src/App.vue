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

import { useQueryClient } from 'vue-query'
import { useStore } from 'vuex'

export default {
  components: {
    LoadingProgress,
  },
  setup () {
    const store = useStore()
    const queryClient = useQueryClient()
    store.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
      if (!isLoggedIn) {
        // TODO: can I do this in a better place?
        queryClient.clear()
      }
    })
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
