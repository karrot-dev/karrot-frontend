<template>
  <SidenavBox>
    <div slot="name">Map</div>
    <div slot="tools">
      <q-btn small flat>Overview</q-btn>
      <q-btn small flat>Stores</q-btn>
      <q-btn small flat>Users</q-btn>
    </div>
    <div>This would be where leaflet goes...</div>
  </SidenavBox>
</template>

<script>
import { QBtn } from 'quasar'
import SidenavBox from './SidenavBox.vue'

export default {
  components: {
    SidenavBox, QBtn
  }
}
</script>

<style scoped lang="stylus">
</style>