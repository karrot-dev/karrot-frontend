<template>
  <QTabs>
    <QRouteTab
      slot="title"
      :to="{ name: 'placePickups', params: { groupId, placeId } }"
      default
      :label="$t('GROUP.PICKUPS')"
      icon="fas fa-shopping-basket"
    />
    <QRouteTab
      slot="title"
      :to="{ name: 'placeWall', params: { groupId, placeId } }"
      :label="$t('GROUP.WALL')"
      :count="cappedWallUnreadCount"
      icon="fas fa-bullhorn"
    />
    <QRouteTab
      slot="title"
      :to="{ name: 'placeFeedback', params: { groupId, placeId } }"
      :label="$t('PICKUP_FEEDBACK.TITLE')"
      icon="fas fa-balance-scale"
    />
    <QRouteTab
      slot="title"
      :to="{ name: 'placeHistory', params: { groupId, placeId } }"
      :label="$t('GROUP.HISTORY')"
      icon="far fa-clock"
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
  },
}
</script>
