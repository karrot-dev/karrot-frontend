<template>
  <SidenavBox>
    <template slot="icon">
      <q-icon name="fa-fw fa-shopping-cart" />
    </template>
    <template slot="tools">
      <q-btn
        flat
        small
        round
      >
        <q-icon name="fa-ellipsis-v" />
        <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
        <StoreOptions/>
      </q-btn>
    </template>

    <q-list
      highlight
      no-border
      class="no-padding"
    >
      <q-item :to="{name: 'storePickups', params: { storeId }}">
        <q-item-side class="text-center">
          <q-icon name="fa-calendar-o" />
        </q-item-side>
        <q-item-main>
          {{ $t("GROUP.PICKUPS") }}
        </q-item-main>
      </q-item>
      <q-item :to="{name: 'storeHistory', params: { storeId }}">
        <q-item-side class="text-center">
          <q-icon name="fa-clock-o" />
        </q-item-side>
        <q-item-main>
          {{ $t("GROUP.HISTORY") }}
        </q-item-main>
      </q-item>
    </q-list>

  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QIcon, QItemMain, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreOptions from './StoreOptions'

export default {
  props: {
    storeId: { required: true },
  },
  components: {
    SidenavBox, StoreOptions, QBtn, QList, QItem, QItemSide, QIcon, QItemMain, QTooltip,
  },
}
</script>

<style scoped lang="stylus">
</style>
