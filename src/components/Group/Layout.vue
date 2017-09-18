<template>
  <MainLayout>
    <div slot="sidenav-desktop">
      <SidenavMap/>
      <SidenavGroup/>
      <SidenavStores/>
    </div>
    <div>
      <GroupNavbar/>
      <slot/>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/Layout/MainLayout.vue'
import SidenavMap from '@/components/Sidenav/SidenavMap.vue'
import SidenavGroup from '@/components/Sidenav/SidenavGroup.vue'
import SidenavStores from '@/components/Sidenav/SidenavStores.vue'
import GroupNavbar from '@/components/Group/Navbar.vue'

export default {
  components: { MainLayout, SidenavMap, SidenavGroup, SidenavStores, GroupNavbar },
}
</script>

<style scoped lang="stylus">
</style>