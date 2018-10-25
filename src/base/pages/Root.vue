<template>
  <!-- Don't drop "q-app" class -->

  <div id="q-app">
    <LoadingProgress />
    <router-view />
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
}
</script>
