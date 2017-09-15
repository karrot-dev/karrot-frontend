<template>
  <SidenavBox>
    <div slot="name">Stores</div>
    <div slot="tools">
      <q-btn small flat>            
        <q-icon size="1em" name="fa-plus-circle" />
        Create
      </q-btn>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item v-for="store in stores" :key="store.id">{{ store.name }}</q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QIcon } from 'quasar'
import SidenavBox from './SidenavBox.vue'

export default {
  props: {
    stores: { required: true }
  },
  components: {
    SidenavBox, QBtn, QList, QItem, QIcon
  }
}
</script>

<style scoped lang="stylus">
  .fa
    margin-right: .3em
</style>