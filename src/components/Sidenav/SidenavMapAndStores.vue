<template>
  <span>
    <SidenavMap v-if="!$q.platform.is.mobile"/>
    <router-view name="sidenav"/>
    <router-view name="secondSidenav"/>
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
