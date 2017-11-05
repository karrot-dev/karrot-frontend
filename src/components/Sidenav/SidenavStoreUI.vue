<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-home"></i></div>
    <div slot="tools">
      <q-btn flat>
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        <StoreOptions/>
      </q-btn>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item :to="{name: 'storePickups', params: { storeId }}">{{ $t('GROUP.PICKUPS')}}</q-item>
        <q-item :to="{name: 'storeHistory', params: { storeId }}">{{ $t('GROUP.HISTORY')}}</q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreOptions from './StoreOptions'

export default {
  props: {
    storeId: { required: true },
  },
  components: {
    SidenavBox, StoreOptions, QBtn, QList, QItem,
  },
}
</script>

<style scoped lang="stylus">
</style>
