<template>
  <QTabs
    align="justify"
    color="secondary"
  >
    <QRouteTab
      slot="title"
      :to="{ name: 'placePickups', params: { groupId, placeId } }"
      default
      name="p"
      label="pickups"
    />
    <QRouteTab
      slot="title"
      :to="{ name: 'placeWall', params: { groupId, placeId } }"
      name="w"
      label="wall"
    />
    <QRouteTab
      slot="title"
      :to="{ name: 'placeFeedback', params: { groupId, placeId } }"
      name="fe"
      label="feedback"
    />
    <QRouteTab
      slot="title"
      :to="{ name: 'placeHistory', params: { groupId, placeId } }"
      name="h"
      label="history"
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
    }),
  },
}
</script>
