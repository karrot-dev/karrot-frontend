<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
/*
 * Root component
 */
export default {
  metaInfo () {
    return {
      titleTemplate: '%s (Foodsaving)',
    }
  },
}
</script>

<style></style>
