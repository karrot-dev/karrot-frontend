<template>
  <q-list highlight no-border>
    <q-item
      v-for="store in storesSorted" :key="store.id"
      link :to="{name: 'store', params: { storeId: store.id }}">
      <q-item-side class="text-center">
        <q-icon :name="store.ui.icon" :color="store.ui.color">
          <q-tooltip>{{ $t(store.ui.label) }}</q-tooltip>
        </q-icon>
      </q-item-side>
      <q-item-main>
        <q-item-tile label>{{ store.name }}</q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip } from 'quasar'
import { optionsFor } from '@/services/storeStatus'

export default {
  components: { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip },
  props: {
    stores: { required: true, type: Array },
  },
  computed: {
    storesSorted () {
      return this.stores
        .filter(s => s.status !== 'archived')
        .map(s => ({ ...s, ui: optionsFor(s) }))
        .sort((a, b) => a.ui.sort - b.ui.sort)
    },
  },
}
</script>

<style>
</style>
