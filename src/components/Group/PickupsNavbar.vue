<template>
  <q-tabs
    color="tertiary"
    hide="icon"
    class="col"
    ref="groupnav"
  >
    <q-route-tab
      :to="{name: 'groupPickups'}"
      exact
      slot="title">
      {{ $t('GROUP.PICKUPS') }}
    </q-route-tab>
    <q-route-tab
      :to="{name: 'groupFeedback'}"
      exact
      slot="title">
      {{ $t('PICKUP_FEEDBACK.TITLE') }}
    </q-route-tab>
  </q-tabs>
</template>

<script>
import { QTabs, QRouteTab, QBtn, QIcon, QTooltip } from 'quasar'
import GroupOptions from '@/components/Sidenav/GroupOptions'

export default {
  components: { QTabs, QRouteTab, QBtn, QIcon, GroupOptions, QTooltip },
  watch: {
    $route (route) {
      if (route.name !== 'groupPickups' && route.name !== 'groupFeedback') {
        this.$refs.groupnav.selectTab(null)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
