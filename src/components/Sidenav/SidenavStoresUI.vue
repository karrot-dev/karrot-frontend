<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-shopping-cart" />{{ $t('GROUP.STORES') }}</div>
    <div slot="tools">
      <router-link :to="{name: 'storeCreate'}">
        <q-btn class="text-white" small flat>
          <q-icon size="1em" name="fa-plus-circle" />
          {{ $t('BUTTON.CREATE') }}
        </q-btn>
      </router-link>
    </div>
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
  .fa
    margin-right: .3em
</style>
