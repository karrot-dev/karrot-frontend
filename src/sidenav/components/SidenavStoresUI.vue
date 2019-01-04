<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="$q.platform.is.mobile || expanded"
    :expandable="!$q.platform.is.mobile"
  >
    <template slot="icon">
      <QIcon name="fas fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ $t('GROUP.STORES') }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <QToggle
        :value="showAllStores"
        @input="$emit('toggleShowAllStores')"
      >
        <QTooltip v-t="showAllStores ? 'STOREEDIT.SHOW_ACTIVE_ONLY' : 'STOREEDIT.SHOW_ALL'"/>
      </QToggle>
      <QBtn
        v-if="hasStores && isEditor"
        flat
        dense
        round
        :to="{ name: 'storeCreate', params: { groupId } }"
      >
        <QIcon name="fas fa-fw fa-plus-circle" />
        <QTooltip v-t="'BUTTON.CREATE'" />
      </QBtn>
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
import StoreList from '@/stores/components/StoreList'

export default {
  props: {
    groupId: { default: null, type: Number },
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
