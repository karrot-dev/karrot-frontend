<template>
  <SidenavBox>
    <template slot="icon">
      <QIcon name="fas fa-fw fa-home" />
    </template>
    <template slot="name">
      {{ $t('GROUP.HOME') }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <QBtn
        flat
        dense
        round
        :to="{ name: 'groupSettings', params: { groupId } }"
      >
        <QIcon name="fas fa-cog fa-fw" />
        <QTooltip v-t="'GROUP.SETTINGS'" />
      </QBtn>
      <QBtn
        flat
        dense
        round
      >
        <QIcon name="fas fa-fw fa-ellipsis-v" />
        <GroupOptions />
      </QBtn>
    </div>

    <div>
      <QList
        highlight
        no-border
        class="no-padding"
      >
        <QItem :to="{ name: 'group', params: { groupId } }">
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
        <QItem :to="{ name: 'groupPickups', params: { groupId } }">
          <QItemSide class="text-center">
            <QIcon name="fas fa-shopping-basket" />
          </QItemSide>
          <QItemMain>
            {{ $t("GROUP.PICKUPS") }}
          </QItemMain>
        </QItem>
        <QItem :to="{ name: 'groupFeedback', params: { groupId } }">
          <QItemSide class="text-center">
            <QIcon name="fas fa-balance-scale" />
          </QItemSide>
          <QItemMain>
            {{ $t("PICKUP_FEEDBACK.TITLE") }}
          </QItemMain>
        </QItem>
        <QItem :to="{ name: 'issueList', params: { groupId } }">
          <QItemSide class="text-center">
            <QIcon name="fas fa-vote-yea" />
          </QItemSide>
          <QItemMain>
            {{ $t("ISSUE.TITLE") }}
          </QItemMain>
        </QItem>
        <QItem :to="{ name: 'groupDescription', params: { groupId } }">
          <QItemSide class="text-center">
            <i class="far fa-address-card" />
          </QItemSide>
          <QItemMain>
            {{ $t("GROUP.DESCRIPTION") }}
          </QItemMain>
        </QItem>
        <QItem :to="{ name: 'groupMembers', params: { groupId } }">
          <QItemSide class="text-center">
            <QIcon name="fas fa-users" />
          </QItemSide>
          <QItemMain>
            {{ $t("GROUP.MEMBERS") }}
          </QItemMain>
        </QItem>
        <QItem :to="{ name: 'groupHistory', params: { groupId } }">
          <QItemSide class="text-center">
            <i class="far fa-clock" />
          </QItemSide>
          <QItemMain>
            {{ $t("GROUP.HISTORY") }}
          </QItemMain>
        </QItem>
        <QItem
          v-if="$q.platform.is.mobile"
          :to="{ name: 'map', params: { groupId } }"
        >
          <QItemSide class="text-center">
            <QIcon name="fas fa-map" />
          </QItemSide>
          <QItemMain>
            {{ $t('GROUPMAP.TITLE') }}
          </QItemMain>
        </QItem>
      </QList>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QItemMain, QIcon, QTooltip, QChip } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QItemSide, QItemMain, QIcon, QTooltip, QChip,
  },
  props: {
    groupId: {
      default: null,
      type: Number,
    },
    wallUnreadCount: {
      default: 0,
      type: Number,
    },
  },
  computed: {
    cappedWallUnreadCount () {
      return this.wallUnreadCount > 99 ? '99+' : this.wallUnreadCount
    },
  },
}
</script>
