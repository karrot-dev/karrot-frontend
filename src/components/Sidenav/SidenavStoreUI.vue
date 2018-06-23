<template>
  <SidenavBox
    v-if="storeId"
    @toggle="$emit('toggleBox')"
    :expanded="expanded"
  >
    <template slot="icon">
      <q-icon name="fas fa-fw fa-shopping-cart" />
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <q-btn
        flat
        dense
        round
      >
        <q-icon name="fas fa-fw fa-ellipsis-v" />
        <StoreOptions/>
      </q-btn>
    </div>

    <!--
    <q-list
      highlight
      no-border
      class="no-padding"
    >
      <q-item :to="{name: 'storePickups', params: { storeId }}">
        <q-item-side class="text-center">
          <q-icon name="fas fa-shopping-basket" />
        </q-item-side>
        <q-item-main>
          {{ $t("GROUP.PICKUPS") }}
        </q-item-main>
      </q-item>
      <q-item :to="{name: 'storeFeedback', params: { storeId }}">
        <q-item-side class="text-center">
          <q-icon name="fas fa-balance-scale" />
        </q-item-side>
        <q-item-main>
          {{ $t("PICKUP_FEEDBACK.TITLE") }}
        </q-item-main>
      </q-item>
      <q-item :to="{name: 'storeHistory', params: { storeId }}">
        <q-item-side class="text-center">
          <i class="far fa-clock"/>
        </q-item-side>
        <q-item-main>
          {{ $t("GROUP.HISTORY") }}
        </q-item-main>
      </q-item>
    </q-list>
    -->

  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QIcon, QItemMain } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreOptions from './StoreOptions'

export default {
  props: {
    storeId: { default: null, type: Number },
    expanded: { default: true, type: Boolean },
  },
  components: {
    SidenavBox, StoreOptions, QBtn, QList, QItem, QItemSide, QIcon, QItemMain,
  },
}
</script>

<style scoped lang="stylus">
</style>
