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
import LoadingProgress from '@/components/Layout/LoadingProgress.vue'
export default {
  components: { LoadingProgress },
}
</script>

<style></style>
