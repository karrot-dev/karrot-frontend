<template>
  <QTabs
    class="shadow-3 bg-white k-place-tabs"
    align="left"
    mobile-arrows
  >
    <QRouteTab
      v-for="(tab, idx) in tabs"
      :key="idx"
      :to="tab.to"
      :label="tab.label"
      exact
    >
      <QBadge
        v-if="tab.count"
        color="secondary"
        floating
      >
        {{ tab.count }}
      </QBadge>
    </QRouteTab>
  </QTabs>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  QTabs,
  QRouteTab,
  QBadge,
} from 'quasar'

export default {
  components: {
    QTabs,
    QRouteTab,
    QBadge,
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      placeId: 'places/activePlaceId',
      wallUnreadCount: 'status/activePlaceWallUnreadCount',
      isEditor: 'currentGroup/isEditor',
    }),
    cappedWallUnreadCount () {
      return this.wallUnreadCount > 99 ? '99+' : this.wallUnreadCount
    },
    tabs () {
      const params = { groupId: this.groupId, placeId: this.placeId }
      return [
        {
          to: { name: 'placeActivities', params },
          label: this.$t('GROUP.ACTIVITIES'),
        },
        {
          to: { name: 'placeWall', params },
          label: this.$t('GROUP.WALL'),
          count: this.cappedWallUnreadCount,
        },
        {
          to: { name: 'placeFeedback', params },
          label: this.$t('ACTIVITY_FEEDBACK.TITLE'),
        },
        {
          to: { name: 'placeHistory', params },
          label: this.$t('GROUP.HISTORY'),
        },
        ...(this.isEditor
          ? [
              {
                to: { name: 'placeActivitiesManage', params },
                label: this.$t('ACTIVITYMANAGE.TITLE'),
              },
            ]
          : []),
      ]
    },
  },
}
</script>
