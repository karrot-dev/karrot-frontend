<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="expanded"
  >
    <template slot="icon">
      <q-icon name="fas fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ $t('GROUP.STORES') }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <q-toggle
        :value="showAllStores"
        @input="$emit('toggleShowAllStores')"
      >
        <q-tooltip v-t="showAllStores ? 'STOREEDIT.SHOW_ACTIVE_ONLY' : 'STOREEDIT.SHOW_ALL'"/>
      </q-toggle>
      <q-btn
        v-if="hasStores && isEditor"
        flat
        dense
        round
        :to="{ name: 'storeCreate', params: { groupId } }"
      >
        <q-icon name="fas fa-fw fa-plus-circle" />
        <q-tooltip v-t="'BUTTON.CREATE'" />
      </q-btn>
    </div>

    <StoreList
      :group-id="groupId"
      :stores="stores"
      :archived="showAllStores ? archived : []"
    />
  </SidenavBox>
</template>

<script>

import { QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QToggle, QTooltip, QItemTile } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreList from '@/components/Store/StoreList'

export default {
  props: {
    groupId: { required: true, type: Number },
    stores: { required: true, type: Array },
    showAllStores: { default: false, type: Boolean },
    archived: { default: () => [], type: Array },
    expanded: { default: true, type: Boolean },
    isEditor: { default: false, type: Boolean },
  },
  components: {
    SidenavBox, QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QToggle, QTooltip, StoreList, QItemTile,
  },
  data () {
    return {
      showArchived: false,
    }
  },
  methods: {
    toggleArchived () {
      this.showArchived = !this.showArchived
    },
  },
  computed: {
    hasStores () {
      return this.stores && this.stores.length > 0
    },
  },
}
</script>

<style scoped lang="stylus">
.tools
  .bottom-right
    left 5px
    top 5px
</style>
