<template>
  <SidenavBox>
    <template #icon>
      <QIcon name="fas fa-fw fa-home" />
    </template>
    <template #name>
      {{ $t('GROUP.HOME') }}
    </template>
    <template #tools>
      <div>
        <QBtn
          flat
          dense
          round
          size="sm"
          :to="{ name: 'groupDescription' }"
          :title="$t('GROUP.DESCRIPTION')"
        >
          <QIcon name="fas fa-info-circle fa-fw" />
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
    <QExpansionItem
      dense
      switch-toggle-side
      expand-separator
    >
      <template v-slot:header>
        <QItemSection>
          {{ $t('BUTTON.SHOW_MORE') }}
        </QItemSection>
        <QItemSection side>
          <QBadge
            v-if="pendingApplications.length > 0"
            small
            :label="pendingApplications.length"
            :title="$tc('APPLICATION.WALL_NOTICE', pendingApplications.length, { count: pendingApplications.length })"
            color="blue"
          />
        </QItemSection>
      </template>
      <SidenavMenu :entries-more="entriesMore" />
    </QExpansionItem>
  </SidenavBox>
</template>

<script>
import {
  QBtn,
  QIcon,
  QMenu,
  QExpansionItem,
  QItemSection,
  QBadge,
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
    QExpansionItem,
    QItemSection,
    QBadge,
  },
  props: {
    groupId: {
      default: null,
      type: Number,
    },
    features: {
      default: () => [],
      type: Array,
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
        condition: this.hasFeature('offers'),
        label: this.$t('GROUP.OFFERS') + (new Date().getFullYear() < 2020 ? ' 🆕' : ''),
        icon: this.$icon('offer'),
        to: { name: 'groupOffers', params: { groupId: this.groupId } },
      }, {
        label: this.$t('PICKUP_FEEDBACK.TITLE'),
        icon: this.$icon('feedback'),
        to: { name: 'groupFeedback', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.MEMBERS'),
        icon: 'fas fa-users',
        to: { name: 'groupMembers', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.HISTORY'),
        icon: 'far fa-clock',
        to: { name: 'groupHistory', params: { groupId: this.groupId } },
      }].filter(e => typeof e.condition === 'undefined' || e.condition === true)
    },
    entriesMore () {
      return [{
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
        label: this.$t('GROUPINFO.META'),
        icon: 'fas fa-eye fa-fw',
        to: { name: 'groupPreview', params: { groupPreviewId: this.groupId } },
      }, {
        condition: this.$q.platform.is.mobile,
        label: this.$t('GROUPMAP.TITLE'),
        icon: 'fas fa-map',
        to: { name: 'map', params: { groupId: this.groupId } },
      }].filter(e => typeof e.condition === 'undefined' || e.condition === true)
    },
  },
  methods: {
    hasFeature (feature) {
      return this.features.includes(feature)
    },
  },
}
</script>
