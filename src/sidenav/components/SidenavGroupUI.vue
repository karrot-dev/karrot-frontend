<template>
  <SidenavBox>
    <template v-slot:icon>
      <QIcon name="fas fa-fw fa-home" />
    </template>
    <template v-slot:name>
      {{ $t('GROUP.HOME') }}
    </template>
    <template v-slot:tools>
      <div>
        <QBtn
          flat
          dense
          round
          size="sm"
          :to="{ name: 'settings', hash: '#notifications' }"
          :title="$t('GROUP.SETTINGS')"
        >
          <QIcon name="fas fa-cog fa-fw" />
        </QBtn>
        <QBtn
          flat
          dense
          round
          size="sm"
        >
          <QIcon name="fas fa-fw fa-ellipsis-v" />
          <QMenu
            fit
            anchor="bottom right"
            self="top right"
          >
            <GroupOptions />
          </QMenu>
        </QBtn>
      </div>
    </template>
    <SidenavMenu :entries="entries" />
  </SidenavBox>
</template>

<script>
import {
  QBtn,
  QIcon,
  QMenu,
} from 'quasar'
import SidenavBox from './SidenavBox'
import SidenavMenu from './SidenavMenu'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox,
    SidenavMenu,
    GroupOptions,
    QBtn,
    QIcon,
    QMenu,
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
    entries () {
      return [{
        label: this.$t('GROUP.WALL'),
        icon: 'fas fa-bullhorn',
        to: { name: 'group', params: { groupId: this.groupId } },
        badge: {
          condition: this.wallUnreadCount > 0,
          label: this.cappedWallUnreadCount,
          color: 'secondary',
        },
      }, {
        label: this.$t('GROUP.PICKUPS'),
        icon: this.$icon('pickup'),
        to: { name: 'groupPickups', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.OFFERS'),
        icon: this.$icon('offers'),
        to: { name: 'groupOffers', params: { groupId: this.groupId } },
      }, {
        label: this.$t('PICKUP_FEEDBACK.TITLE'),
        icon: this.$icon('feedback'),
        to: { name: 'groupFeedback', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.APPLICATIONS'),
        icon: 'fas fa-address-card',
        to: { name: 'applications', params: { groupId: this.groupId } },
        badge: {
          condition: this.pendingApplications.length > 0,
          label: this.pendingApplications.length,
          color: 'blue',
          title: this.$tc('APPLICATION.WALL_NOTICE', this.pendingApplications.length, { count: this.pendingApplications.length }),
        },
      }, {
        label: this.$t('ISSUE.TITLE'),
        icon: 'fas fa-vote-yea',
        to: { name: 'issueList', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.DESCRIPTION'),
        icon: 'far fa-address-card',
        to: { name: 'groupDescription', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.MEMBERS'),
        icon: 'fas fa-users',
        to: { name: 'groupMembers', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.HISTORY'),
        icon: 'far fa-clock',
        to: { name: 'groupHistory', params: { groupId: this.groupId } },
      }, {
        condition: this.$q.platform.is.mobile,
        label: this.$t('GROUPMAP.TITLE'),
        icon: 'fas fa-map',
        to: { name: 'map', params: { groupId: this.groupId } },
      }].filter(e => typeof e.condition === 'undefined' || e.condition === true)
    },
  },
}
</script>
