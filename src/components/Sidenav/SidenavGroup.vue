<template>
  <SidenavBox>
    <div slot="name">Group</div>
    <div slot="tools">
      <q-btn small flat>Extra Options</q-btn>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item>Detail</q-item>
        <q-item>Pickups (Do we need that still?)</q-item>
        <q-item>History</q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem } from 'quasar'
import SidenavBox from './SidenavBox.vue'

export default {
  components: {
    SidenavBox, QBtn, QList, QItem
  }
}
</script>

<style scoped lang="stylus">
</style>