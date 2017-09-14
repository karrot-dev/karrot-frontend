<template>
  <SidenavBox>
    <div slot="name">Map</div>
    <div slot="tools">
      <q-btn flat>Overview</q-btn>
      <q-btn flat>Stores</q-btn>
      <q-btn flat>Users</q-btn>
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