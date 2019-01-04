<template>
  <QList
    highlight
    no-border
    class="no-padding"
  >
    <QItem
      v-for="store in stores"
      :key="store.id"
      link
      :to="linkParamsFor(store)"
    >
      <QItemSide class="text-center">
        <QIcon
          :name="store.ui.icon"
          :color="store.ui.color"
          :title="$t(store.ui.label)"
        />
      </QItemSide>
      <QItemMain>
        <QItemTile label>
          {{ store.name }}
        </QItemTile>
      </QItemMain>
    </QItem>

    <QItem
      v-if="!hasStores && isEditor"
      link
      :to="{ name: 'storeCreate', params: { groupId } }"
      class="bg-secondary"
      multiline
    >
      <QItemMain class="text-center">
        <QItemTile
          icon="add circle"
          class="text-white"
        />
        <QTooltip v-t="'BUTTON.CREATE'" />
      </QItemMain>
    </QItem>

    <QItemSeparator v-if="archived.length > 0" />

    <QCollapsible
      v-if="archived.length > 0 && isEditor"
      icon="fas fa-trash-alt"
      :label="`${$t('STORESTATUS.ARCHIVED')} (${archived.length})`"
    >
      <QItem
        v-for="store in archived"
        :key="store.id"
        link
        :to="linkParamsFor(store)"
      >
        <QItemMain>
          <QItemTile label>
            {{ store.name }}
          </QItemTile>
        </QItemMain>
      </QItem>
    </QCollapsible>
  </QList>
</template>

<script>
import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip, QCollapsible, QItemSeparator } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, QIcon, QTooltip, QCollapsible, QItemSeparator },
  props: {
    groupId: { default: null, type: Number },
    stores: { required: true, type: Array },
    archived: { default: () => [], type: Array },
    linkTo: { default: 'store', type: String },

  },
  computed: {
    hasStores () {
      return this.stores && this.stores.length > 0
    },
    ...mapGetters({
      isEditor: 'currentGroup/isEditor',
    }),
  },
  methods: {
    linkParamsFor (store) {
      return {
        name: this.linkTo,
        params: {
          groupId: store.group.id,
          storeId: store.id,
        },
      }
    },
  },
}
</script>
