<template>
  <SidenavBox>
    <template slot="icon">
      <q-icon name="fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ $t('GROUP.STORES') }}
    </template>
    <template slot="tools">
      <q-btn
        v-if="hasStores"
        flat
        @click="$router.push({name: 'storeCreate'})"
      >
        <q-icon name="add circle" />
        <q-tooltip v-t="'BUTTON.CREATE'" />
      </q-btn>
    </template>

    <StoreList :stores="stores"/>
  </SidenavBox>
</template>

<script>

import { QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip, QItemTile } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreList from '@/components/Store/StoreList'

export default {
  props: {
    stores: { required: true, type: Array },
  },
  components: {
    SidenavBox, QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip, StoreList, QItemTile,
  },
  computed: {
    hasStores () {
      return this.stores && this.stores.length > 0
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
