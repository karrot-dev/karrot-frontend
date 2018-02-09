<template>
  <!-- Don't drop "q-app" class -->

  <div id="q-app">
    <LoadingProgress />
    <router-view />
    <BackToTopBtn />
  </div>
</template>

<script>
/*
 * Root component
 */
import LoadingProgress from '@/components/Layout/LoadingProgress'
import BackToTopBtn from '@/components/BackToTopBtn'
export default {
  components: { LoadingProgress,
    BackToTopBtn,
  },
}
</script>
