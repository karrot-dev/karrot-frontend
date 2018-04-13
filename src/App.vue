<template>
  <!-- Don't drop "q-app" class -->

  <div id="q-app">
    <LoadingProgress />
    <router-view />
    <BackToTopBtn />
    <VueBrowserUpdate />
  </div>
</template>

<script>
/*
 * Root component
 */
import LoadingProgress from '@/components/Layout/LoadingProgress'
import BackToTopBtn from '@/components/BackToTopBtn'
import VueBrowserUpdate from 'vue-browserupdate'
export default {
  components: {
    LoadingProgress,
    BackToTopBtn,
    VueBrowserUpdate,
  },
}
</script>
