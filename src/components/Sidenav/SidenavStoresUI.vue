<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="expanded"
  >
    <template slot="icon">
      <q-icon name="fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ $t('GROUP.STORES') }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <q-btn
        v-if="hasArchivedStores"
        flat
        small
        @click="toggleArchived"
      >
        <span class="fa-fw fa-stack">
          <i class="fas fa-trash-alt fa-stack-1x" />
          <i
            v-if="showArchived"
            class="fa fa-check bottom-right fa-stack-1x text-positive"
          />
          <i
            v-else
            class="fa fa-times bottom-right fa-stack-1x text-negative"
          />
        </span>
        <q-tooltip>
          {{ $t( showArchived ? 'STOREEDIT.HIDE_ARCHIVED' : 'STOREEDIT.SHOW_ARCHIVED') }}
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="hasStores"
        flat
        small
        @click="$router.push({name: 'storeCreate'})"
      >
        <q-icon name="fa-fw fa-plus-circle" />
        <q-tooltip v-t="'BUTTON.CREATE'" />
      </q-btn>
    </div>

    <StoreList
      :stores="stores"
      :archived="showArchived ? archived : []"
    />
  </SidenavBox>
</template>

<script>

import { QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip, QItemTile } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreList from '@/components/Store/StoreList'

export default {
  props: {
    stores: { required: true, type: Array },
    archived: { default: () => [], type: Array },
    expanded: { default: true, type: Boolean },
  },
  components: {
    SidenavBox, QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip, StoreList, QItemTile,
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
    hasArchivedStores () {
      return this.archived.length > 0
    },
  },
}
</script>

<style scoped lang="stylus">
.tools
  .fa.bottom-right
    left 5px
    top 5px
  .q-btn
    width 30px
    padding 0 1px
</style>
