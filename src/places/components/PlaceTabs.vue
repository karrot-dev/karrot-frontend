<template>
  <QTabs
    inverted
    class="shadow-3 k-place-tabs"
  >
    <QRouteTab
      v-for="(tab, idx) in tabs"
      :key="idx"
      :to="tab.to"
      :default="idx === 0"
      :label="tab.label"
      :count="tab.count"
      exact
    />
  </QTabs>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  QTabs,
  QRouteTab,
} from 'quasar'

export default {
  components: {
    QTabs,
    QRouteTab,
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      placeId: 'places/activePlaceId',
      wallUnreadCount: 'places/conversationUnreadCount',
      isEditor: 'currentGroup/isEditor',
    }),
    cappedWallUnreadCount () {
      return this.wallUnreadCount > 99 ? '99+' : this.wallUnreadCount
    },
    tabs () {
      const params = { groupId: this.groupId, placeId: this.placeId }
      return [
        {
          to: { name: 'placePickups', params },
          label: this.$t('GROUP.PICKUPS'),
        },
        {
          to: { name: 'placeWall', params },
          label: this.$t('GROUP.WALL'),
          count: this.cappedWallUnreadCount,
        },
        {
          to: { name: 'placeFeedback', params },
          label: this.$t('PICKUP_FEEDBACK.TITLE'),
        },
        {
          to: { name: 'placeHistory', params },
          label: this.$t('GROUP.HISTORY'),
        },
        ...(this.isEditor ? [
          {
            to: { name: 'placePickupsManage', params },
            label: this.$t('PICKUPMANAGE.TITLE'),
          },
          {
            to: { name: 'placeEdit', params },
            label: this.$t('STOREDETAIL.EDIT'),
          },
        ] : []),
      ]
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~variables'

.k-place-tabs >>> .q-tab .q-chip
  background alpha($secondary, 0.85)
</style>
