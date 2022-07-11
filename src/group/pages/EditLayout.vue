<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <div>
    <QTabs
      class="bg-white"
      align="left"
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
    <RouterView />
  </div>
</template>

<script>
import {
  QTabs,
  QRouteTab,
  QBadge,
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: {
    QTabs,
    QRouteTab,
    QBadge,
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
    }),
    tabs () {
      const params = { groupId: this.groupId }
      return [
        {
          to: { name: 'groupEditDetails', params },
          label: this.$t('GROUP.EDIT_DETAILS'),
        },
        {
          to: { name: 'groupEditActivityTypes', params },
          label: this.$t('GROUP.EDIT_ACTIVITY_TYPES'),
        },
      ]
    },
  },
}
</script>
