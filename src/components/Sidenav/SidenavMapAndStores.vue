<template>
  <span>
    <SidenavMap/>
    <router-view name="sidenav"></router-view>
    <SidenavStores/>
  </span>
</template>

<script>
import SidenavMap from './SidenavMap'
import SidenavStores from './SidenavStores'

export default {
  components: {
    SidenavMap, SidenavStores,
  },
}
</script>

<style scoped lang="stylus">
</style>
