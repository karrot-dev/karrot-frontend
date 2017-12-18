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
        flat
        @click="$router.push({name: 'storeCreate'})"
      >
        <q-icon name="add circle" />
        <q-tooltip v-t="'BUTTON.CREATE'" />
      </q-btn>
    </template>

    <div>
      <store-list :stores="stores"/>
    </div>
  </SidenavBox>
</template>

<script>

import { QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreList from '@/components/Store/StoreList'

export default {
  props: {
    stores: { required: true },
  },
  components: {
    SidenavBox, QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip, StoreList,
  },
}
</script>

<style scoped lang="stylus">
</style>
