<template>
  <Layout>
    <Map class="map"/>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout/MainLayout.vue'
import Map from '@/components/Map/GroupMap.vue'

export default {
  components: { Layout, Map },
}
</script>

<style scoped lang="stylus">
.map
  width: 100%
  height: 100vh
</style>
