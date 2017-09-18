<template>
  <q-list highlight no-border>
    <q-item link :to="{name: 'store', params: { storeId: store.id }}" v-for="store in stores" :key="store.id">
      <q-item-main>
        <q-item-tile label>{{ store.name }}</q-item-tile>
      </q-item-main>
      <q-item-side right>
        <q-item-tile><i class="fa fa-pencil"/></q-item-tile>
      </q-item-side>
    </q-item>
  </q-list>
</template>

<script>
import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QItemSeperator } from 'quasar'

export default {
  components: { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QItemSeperator },
  props: {
    stores: { required: true },
  },
}
</script>

<style>
</style>
