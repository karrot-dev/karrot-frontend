<template>
  <q-list highlight no-border>
    <q-item
      v-for="store in stores" :key="store.id"
      link :to="{name: 'store', params: { storeId: store.id }}">
      <q-item-main>
        <q-item-tile label>{{ store.name }}</q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide } from 'quasar'

export default {
  components: { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide },
  props: {
    stores: { required: true },
  },
}
</script>

<style>
</style>
