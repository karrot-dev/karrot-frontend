<template>
  <SidenavBox>
    <div slot="name">Stores</div>
    <div slot="tools">
      <q-btn small flat>Create</q-btn>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item>Store 1</q-item>
        <q-item>Store 2</q-item>
        <q-item>Store 3</q-item>
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