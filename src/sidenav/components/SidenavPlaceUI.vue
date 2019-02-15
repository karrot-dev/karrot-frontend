<template>
  <SidenavBox
    v-if="place"
    @toggle="$emit('toggleBox')"
    :expanded="$q.platform.is.mobile || expanded"
    :expandable="!$q.platform.is.mobile"
  >
    <template slot="icon">
      <QIcon name="fas fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ place.name }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <QChip
        v-if="!expanded && wallUnreadCount > 0"
        small
        color="secondary"
      >
        {{ cappedWallUnreadCount }}
      </QChip>
      <QBtn
        v-if="isEditor"
        flat
        dense
        round
      >
        <QIcon name="fas fa-fw fa-ellipsis-v" />
        <PlaceOptions/>
      </QBtn>
    </div>

    <QList
      highlight
      no-border
      class="no-padding"
    >
      <QItem :to="{name: 'placeWall', params: { placeId }}">
        <QItemSide class="text-center">
          <QIcon name="fas fa-bullhorn" />
        </QItemSide>
        <QItemMain>
          {{ $t("GROUP.WALL") }}
        </QItemMain>
        <QItemSide
          v-if="wallUnreadCount > 0"
          right
        >
          <QChip
            small
            color="secondary"
          >
            {{ cappedWallUnreadCount }}
          </QChip>
        </QItemSide>
      </QItem>
      <QItem :to="{name: 'placePickups', params: { placeId }}">
        <QItemSide class="text-center">
          <QIcon name="fas fa-shopping-basket" />
        </QItemSide>
        <QItemMain>
          {{ $t("GROUP.PICKUPS") }}
        </QItemMain>
      </QItem>
      <QItem :to="{name: 'placeFeedback', params: { placeId }}">
        <QItemSide class="text-center">
          <QIcon name="fas fa-balance-scale" />
        </QItemSide>
        <QItemMain>
          {{ $t("PICKUP_FEEDBACK.TITLE") }}
        </QItemMain>
      </QItem>
      <QItem :to="{name: 'placeHistory', params: { placeId }}">
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
import {
  QBtn,
  QList,
  QItem,
  QItemSide,
  QIcon,
  QItemMain,
  QChip,
} from 'quasar'
import SidenavBox from './SidenavBox'
import PlaceOptions from './PlaceOptions'

export default {
  props: {
    place: {
      default: null,
      type: Object,
    },
    expanded: {
      default: true,
      type: Boolean,
    },
    isEditor: {
      default: false,
      type: Boolean,
    },
    wallUnreadCount: {
      default: 0,
      type: Number,
    },
  },
  components: {
    SidenavBox,
    PlaceOptions,
    QBtn,
    QList,
    QItem,
    QItemSide,
    QIcon,
    QItemMain,
    QChip,
  },
  computed: {
    cappedWallUnreadCount () {
      return this.wallUnreadCount > 99 ? '99+' : this.wallUnreadCount
    },
    placeId () {
      return this.place && this.place.id
    },
  },
}
</script>
