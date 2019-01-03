<template>
  <SidenavBox
    v-if="storeId"
    @toggle="$emit('toggleBox')"
    :expanded="$q.platform.is.mobile || expanded"
    :expandable="!$q.platform.is.mobile"
  >
    <template slot="icon">
      <QIcon name="fas fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ $t('GROUP.CURRENT_STORE') }}
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
    storeId: { default: null, type: Number },
    expanded: { default: true, type: Boolean },
    isEditor: { default: false, type: Boolean },
  },
  components: {
    SidenavBox, StoreOptions, QBtn, QList, QItem, QItemSide, QIcon, QItemMain,
  },
}
</script>

<style scoped lang="stylus">
</style>
