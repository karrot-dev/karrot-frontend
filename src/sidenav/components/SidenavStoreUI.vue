<template>
  <SidenavBox
    v-if="store"
    @toggle="$emit('toggleBox')"
    :expanded="$q.platform.is.mobile || expanded"
    :expandable="!$q.platform.is.mobile"
  >
    <template slot="icon">
      <QIcon name="fas fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ store.name }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <QBtn
        v-if="isEditor"
        flat
        dense
        round
      >
        <QIcon name="fas fa-fw fa-ellipsis-v" />
        <StoreOptions/>
      </QBtn>
    </div>

    <QList
      highlight
      no-border
      class="no-padding"
    >
      <QItem :to="{name: 'storePickups', params: { storeId }}">
        <QItemSide class="text-center">
          <QIcon name="fas fa-shopping-basket" />
        </QItemSide>
        <QItemMain>
          {{ $t("GROUP.PICKUPS") }}
        </QItemMain>
      </QItem>
      <QItem :to="{name: 'storeFeedback', params: { storeId }}">
        <QItemSide class="text-center">
          <QIcon name="fas fa-balance-scale" />
        </QItemSide>
        <QItemMain>
          {{ $t("PICKUP_FEEDBACK.TITLE") }}
        </QItemMain>
      </QItem>
      <QItem :to="{name: 'storeHistory', params: { storeId }}">
        <QItemSide class="text-center">
          <i class="far fa-clock"/>
        </QItemSide>
        <QItemMain>
          {{ $t("GROUP.HISTORY") }}
        </QItemMain>
      </QItem>
    </QList>

  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QIcon, QItemMain } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreOptions from './StoreOptions'

export default {
  props: {
    store: { default: null, type: Object },
    expanded: { default: true, type: Boolean },
    isEditor: { default: false, type: Boolean },
  },
  components: {
    SidenavBox, StoreOptions, QBtn, QList, QItem, QItemSide, QIcon, QItemMain,
  },
  computed: {
    storeId () {
      return this.store && this.store.id
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
