<template>
  <SidenavBox
    @toggleBoxCollapsed="$emit('toggleBoxCollapsed')"
    :collapsible="collapsible"
    :collapsed="collapsed">
    <template slot="icon">
      <q-icon name="fa-fw fa-shopping-cart" />
    </template>
    <template slot="tools">
      <q-btn
        flat
        small
      >
        <q-icon name="fa-fw fa-ellipsis-v" />
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
          <q-icon name="fa-shopping-basket" />
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
    collapsible: { default: true },
    collapsed: { required: true },
  },
  components: {
    SidenavBox, StoreOptions, QBtn, QList, QItem, QItemSide, QIcon, QItemMain, QTooltip,
  },
}
</script>

<style scoped lang="stylus">
</style>
