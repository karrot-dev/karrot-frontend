<template>
  <q-list
    highlight
    no-border
    class="no-padding"
  >
    <q-item
      v-for="store in stores"
      :key="store.id"
      link
      :to="{name: linkTo, params: { storeId: store.id }}"
    >
      <q-item-side class="text-center">
        <q-icon
          :name="store.ui.icon"
          :color="store.ui.color"
        >
          <q-tooltip v-t="store.ui.label" />
        </q-icon>
      </q-item-side>
      <q-item-main>
        <q-item-tile label>
          {{ store.name }}
        </q-item-tile>
      </q-item-main>
    </q-item>

    <q-item
      v-if="!hasStores"
      link
      :to="{name: 'storeCreate'}"
      class="bg-secondary"
      multiline
    >
      <q-item-main class="text-center">
        <q-item-tile
          icon="add circle"
          class="text-white"
        />
        <q-tooltip v-t="'BUTTON.CREATE'" />
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip } from 'quasar'

export default {
  components: { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip },
  props: {
    stores: { required: true, type: Array },
    linkTo: { default: 'store', type: String },
  },
  computed: {
    hasStores () {
      return this.stores && this.stores.length > 0
    },
  },
}
</script>
