<template>
  <div
    slot="navigation"
    class="row no-wrap"
  >
    <q-tabs
      color="transparent"
      hide="icon"
      class="col"
      ref="groupnav"
    >
      <q-route-tab
        :to="{name: 'group'}"
        exact
        slot="title"
      >
        {{ $t('GROUP.WALL') }}
      </q-route-tab>
      <q-route-tab
        :to="{name: 'groupDescription'}"
        exact
        slot="title"
      >
        {{ $t('GROUP.DESCRIPTION') }}
      </q-route-tab>
      <q-route-tab
        :to="{name: 'groupHistory'}"
        exact
        slot="title"
      >
        {{ $t('GROUP.HISTORY') }}
      </q-route-tab>
    </q-tabs>
    <q-btn
      flat
      class="text-white"
    >
      <q-icon name="fas fa-ellipsis-v" />
      <GroupOptions/>
    </q-btn>
  </div>
</template>

<script>
import { QTabs, QRouteTab, QBtn, QIcon } from 'quasar'
import GroupOptions from '@/components/Sidenav/GroupOptions'

export default {
  components: { QTabs, QRouteTab, QBtn, QIcon, GroupOptions },
  watch: {
    $route (route) {
      if (route.name !== 'group' && route.name !== 'groupDescription' && route.name !== 'groupHistory') {
        this.$refs.groupnav.selectTab(null)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
