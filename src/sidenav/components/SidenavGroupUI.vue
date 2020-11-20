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
    <SidenavMenu
      v-if="showMore"
      :entries="entriesMore"
    />
    <QItem
      clickable
      dense
      class="more-button"
      @click="showMore = !showMore"
    >
      <QItemSection
        side
        class="text-center"
      >
        <QIcon
          :name="showMore ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
          size="1.1em"
        />
      </QItemSection>
      <QItemSection>
        {{ showMore ? $t('BUTTON.SHOW_LESS') : $t('BUTTON.SHOW_MORE') }}
      </QItemSection>
      <QItemSection
        v-if="!showMore"
        side
      >
        <QBadge
          v-if="pendingApplicationCount > 0"
          :label="pendingApplicationCount"
          :title="$tc('APPLICATION.WALL_NOTICE', pendingApplicationCount, { count: pendingApplicationCount })"
          color="blue"
        />
      </QItemSection>
    </QItem>
  </SidenavBox>
</template>

<script>
import {
  QBtn,
  QIcon,
  QMenu,
  QItem,
  QItemSection,
  QBadge,
} from 'quasar'
import SidenavBox from './SidenavBox'
import SidenavMenu from './SidenavMenu'
import GroupOptions from './GroupOptions'
import { useGroupStatus } from '@/activities/data/useStatus'
import { useCurrentGroup } from '@/activities/data/useCurrentGroup'

export default {
  components: {
    SidenavBox,
    SidenavMenu,
    GroupOptions,
    QBtn,
    QIcon,
    QMenu,
    QItem,
    QItemSection,
    QBadge,
  },
  props: {
    groupId: {
      default: null,
      type: Number,
    },
    theme: {
      type: String,
      default: null,
    },
    features: {
      default: () => [],
      type: Array,
    },
  },
  setup () {
    const { currentGroupId } = useCurrentGroup()
    const {
      pendingApplicationCount,
      feedbackPossibleCount,
      unreadWallMessageCount,
    } = useGroupStatus({ groupId: currentGroupId })
    return {
      pendingApplicationCount,
      feedbackPossibleCount,
      unreadWallMessageCount,
    }
  },
  data () {
    return {
      showMore: false,
    }
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
        label: this.$t('GROUP.ACTIVITIES'),
        info: this.theme === 'foodsaving' && {
          title: this.$t('GROUP.PICKUPS_TO_ACTIVITIES'),
          description: this.$t('GROUP.PICKUPS_TO_ACTIVITIES_DESCRIPTION'),
          link: {
            text: this.$t('BUTTON.READ_MORE'),
            href: 'https://community.foodsaving.world/t/what-are-activity-types-in-karrot/563',
          },
        },
        icon: this.$icon('activity'),
        to: { name: 'groupActivities', params: { groupId: this.groupId } },
      }, {
        condition: this.hasFeature('offers'),
        label: this.$t('GROUP.OFFERS') + (new Date().getFullYear() < 2020 ? ' 🆕' : ''),
        icon: this.$icon('offer'),
        to: { name: 'groupOffers', params: { groupId: this.groupId } },
      }, {
        label: this.$t('ACTIVITY_FEEDBACK.TITLE'),
        icon: this.$icon('feedback'),
        to: { name: 'groupFeedback', params: { groupId: this.groupId } },
        badge: {
          condition: this.feedbackPossibleCount > 0,
          label: this.feedbackPossibleCount,
          color: 'info',
          title: this.$tc('ACTIVITYLIST.AVAILABLE_FEEDBACK', this.feedbackPossibleCount, { count: this.feedbackPossibleCount }),
        },
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
          condition: this.pendingApplicationCount > 0,
          label: this.pendingApplicationCount,
          color: 'blue',
          title: this.$tc('APPLICATION.WALL_NOTICE', this.pendingApplicationCount, { count: this.pendingApplicationCount }),
        },
      }, {
        label: this.$t('ISSUE.TITLE'),
        icon: 'fas fa-vote-yea',
        to: { name: 'issueList', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUP.STATISTICS'),
        icon: 'fas fa-chart-bar',
        to: { name: 'statistics', params: { groupId: this.groupId } },
      }, {
        label: this.$t('GROUPINFO.META'),
        icon: 'fas fa-info-circle',
        to: { name: 'groupPreview', params: { groupPreviewId: this.groupId } },
      }, {
        condition: this.$q.platform.is.mobile === true,
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

<style lang="stylus" scoped>
.more-button:hover
  opacity .6

  >>> .q-focus-helper
    background none !important
</style>
