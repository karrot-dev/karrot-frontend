<template>
  <div slot="navigation" class="shadow-14 inset-shadow row">
    <q-tabs color="tertiary" hide="icon" class="col" ref="groupnav">
      <q-route-tab
        :to="{name: 'group'}"
        exact
        slot="title">
        {{ $t('GROUP.WALL') }}
      </q-route-tab>
      <q-route-tab
        :to="{name: 'groupDescription'}"
        exact
        slot="title">
        {{ $t('GROUP.DESCRIPTION') }}
      </q-route-tab>
      <q-route-tab
        :to="{name: 'groupHistory'}"
        exact
        slot="title">
        {{ $t('GROUP.HISTORY') }}
      </q-route-tab>
    </q-tabs>
    <q-btn flat class="bg-tertiary text-white">
      <q-icon name="fa-ellipsis-v" />
      <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
      <GroupOptions/>
    </q-btn>
  </div>
</template>

<script>
import { QTabs, QRouteTab, QBtn, QIcon, QTooltip } from 'quasar'
import GroupOptions from '@/components/Sidenav/GroupOptions'

export default {
  components: { QTabs, QRouteTab, QBtn, QIcon, GroupOptions, QTooltip },
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
