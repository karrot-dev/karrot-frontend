<template>
  <SidenavBox
    @toggleBoxCollapsed="$emit('toggleBoxCollapsed')"
    :collapsible="collapsible"
    :collapsed="collapsed">
    <template slot="icon">
      <q-icon name="fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ $t('GROUP.STORES') }}
    </template>
    <template slot="tools">
      <q-btn
        v-if="hasStores"
        flat
        small
        @click="$router.push({name: 'storeCreate'})"
      >
        <q-icon name="fa-fw fa-plus-circle" />
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
    collapsible: { default: true },
    collapsed: { required: true },
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
