<template>
  <span>
    <SidenavMap/>
    <SidenavStores/>
    <router-view name="sidenav"></router-view>
  </span>
</template>

<script>
import SidenavMap from './SidenavMap.vue'
import SidenavStores from './SidenavStores.vue'

export default {
  components: {
    SidenavMap, SidenavStores,
  },
}
</script>

<style scoped lang="stylus">
</style>
