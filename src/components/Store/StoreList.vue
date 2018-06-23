<template>
  <q-list
    highlight
    no-border
    class="no-padding"
  >
    <div
      v-for="store in stores"
      :key="store.id"
    >
      <q-item
        link
        :to="{name: linkTo, params: { storeId: store.id }}"
      >
        <q-item-side class="text-center">
          <q-icon
            :name="store.ui.icon"
            :color="store.ui.color"
            :title="$t(store.ui.label)"
          />
        </q-item-side>
        <q-item-main>
          <q-item-tile label>
            {{ store.name }}
          </q-item-tile>
        </q-item-main>
      </q-item>

      <template v-if="store.isActiveStore">
        <q-item :to="{name: 'storePickups', params: { storeId: store.id }}">
          <q-item-side
            class="text-center"
            style="margin-left: 15px;"
          >
            <q-icon name="fas fa-shopping-basket" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.PICKUPS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'storeFeedback', params: { storeId: store.id }}">
          <q-item-side
            class="text-center"
            style="margin-left: 15px;"
          >
            <q-icon name="fas fa-balance-scale" />
          </q-item-side>
          <q-item-main>
            {{ $t("PICKUP_FEEDBACK.TITLE") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'storeHistory', params: { storeId: store.id }}">
          <q-item-side
            class="text-center"
            style="margin-left: 15px;"
          >
            <i class="far fa-clock"/>
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.HISTORY") }}
          </q-item-main>
        </q-item>
      </template>
    </div>

    <q-item
      v-if="!hasStores || $q.platform.is.mobile"
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

    <q-item-separator v-if="archived.length > 0" />

    <q-collapsible
      v-if="archived.length > 0"
      icon="fas fa-trash-alt"
      :label="`${$t('STORESTATUS.ARCHIVED')} (${archived.length})`"
    >
      <q-item
        v-for="store in archived"
        :key="store.id"
        link
        :to="{name: linkTo, params: { storeId: store.id }}"
      >
        <q-item-main>
          <q-item-tile label>
            {{ store.name }}
          </q-item-tile>
        </q-item-main>
      </q-item>
    </q-collapsible>
  </q-list>
</template>

<script>
import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip, QCollapsible, QItemSeparator } from 'quasar'

export default {
  components: { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip, QCollapsible, QItemSeparator },
  props: {
    stores: { required: true, type: Array },
    archived: { default: () => [], type: Array },
    linkTo: { default: 'store', type: String },
  },
  computed: {
    hasStores () {
      return this.stores && this.stores.length > 0
    },
  },
}
</script>
