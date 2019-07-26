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
        :to="{ name: 'settings', hash: '#notifications' }"
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
          <QItemSection side class="text-center">
            <QIcon name="fas fa-bullhorn" />
          </QItemSection>
          <QItemSection>
            {{ $t("GROUP.WALL") }}
          </QItemSection>
          <QItemSection side
            v-if="wallUnreadCount > 0"
            right
          >
            <QChip
              small
              color="secondary"
            >
              {{ cappedWallUnreadCount }}
            </QChip>
          </QItemSection>
        </QItem>
        <QItem :to="{ name: 'groupPickups', params: { groupId } }">
          <QItemSection side class="text-center">
            <QIcon :name="$icon('pickup')" />
          </QItemSection>
          <QItemSection>
            {{ $t("GROUP.PICKUPS") }}
          </QItemSection>
        </QItem>
        <QItem :to="{ name: 'groupFeedback', params: { groupId } }">
          <QItemSection side class="text-center">
            <QIcon :name="$icon('feedback')" />
          </QItemSection>
          <QItemSection>
            {{ $t("PICKUP_FEEDBACK.TITLE") }}
          </QItemSection>
        </QItem>
        <QItem :to="{ name: 'applications', params: { groupId } }">
          <QItemSection side class="text-center">
            <QIcon name="fas fa-address-card" />
          </QItemSection>
          <QItemSection>
            {{ $t("GROUP.APPLICATIONS") }}
          </QItemSection>
          <QItemSection side
            v-if="pendingApplications.length > 0"
            right
          >
            <QChip
              small
              color="blue"
              :title="$tc('APPLICATION.WALL_NOTICE', pendingApplications.length, { count: pendingApplications.length })"
            >
              {{ pendingApplications.length }}
            </QChip>
          </QItemSection>
        </QItem>
        <QItem :to="{ name: 'issueList', params: { groupId } }">
          <QItemSection side class="text-center">
            <QIcon name="fas fa-vote-yea" />
          </QItemSection>
          <QItemSection>
            {{ $t("ISSUE.TITLE") }}
          </QItemSection>
        </QItem>
        <QItem :to="{ name: 'groupDescription', params: { groupId } }">
          <QItemSection side class="text-center">
            <i class="far fa-address-card" />
          </QItemSection>
          <QItemSection>
            {{ $t("GROUP.DESCRIPTION") }}
          </QItemSection>
        </QItem>
        <QItem :to="{ name: 'groupMembers', params: { groupId } }">
          <QItemSection side class="text-center">
            <QIcon name="fas fa-users" />
          </QItemSection>
          <QItemSection>
            {{ $t("GROUP.MEMBERS") }}
          </QItemSection>
        </QItem>
        <QItem :to="{ name: 'groupHistory', params: { groupId } }">
          <QItemSection side class="text-center">
            <i class="far fa-clock" />
          </QItemSection>
          <QItemSection>
            {{ $t("GROUP.HISTORY") }}
          </QItemSection>
        </QItem>
        <QItem
          v-if="$q.platform.is.mobile"
          :to="{ name: 'map', params: { groupId } }"
        >
          <QItemSection side class="text-center">
            <QIcon name="fas fa-map" />
          </QItemSection>
          <QItemSection>
            {{ $t('GROUPMAP.TITLE') }}
          </QItemSection>
        </QItem>
      </QList>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSection, QIcon, QTooltip, QChip } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QItemSection, QIcon, QTooltip, QChip,
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
    pendingApplications: {
      default: () => [],
      type: Array,
    },
  },
  computed: {
    cappedWallUnreadCount () {
      return this.wallUnreadCount > 99 ? '99+' : this.wallUnreadCount
    },
  },
}
</script>
