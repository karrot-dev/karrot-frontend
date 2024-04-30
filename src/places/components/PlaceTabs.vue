<template>
  <QTabs
    class="bg-white k-place-tabs q-pa-xs"
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
import {
  QTabs,
  QRouteTab,
  QBadge,
} from 'quasar'
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { useActivePlaceService } from '@/places/services'
import { useStatusService } from '@/status/services'

export default {
  components: {
    QTabs,
    QRouteTab,
    QBadge,
  },
  setup () {
    const { groupId, isEditor } = useCurrentGroupService()
    const { placeId } = useActivePlaceService()
    const { getPlaceStatus } = useStatusService()
    const unreadWallMessageCount = computed(() => getPlaceStatus(placeId.value).unreadWallMessageCount)
    return {
      groupId,
      placeId,
      isEditor,
      unreadWallMessageCount,
    }
  },
  computed: {
    cappedUnreadWallMessageCount () {
      return this.unreadWallMessageCount > 99 ? '99+' : this.unreadWallMessageCount
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
          count: this.cappedUnreadWallMessageCount,
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

<style scoped lang="sass">
.k-place-tabs
  border-bottom-left-radius: 12px
  border-bottom-right-radius: 12px

</style>
