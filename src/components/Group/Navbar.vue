<template>
  <div slot="navigation" class="shadow-14 inset-shadow row">
    <q-tabs color="tertiary" hide="icon" class="col">
      <q-route-tab
        :to="{name: 'group'}"
        exact
        slot="title"
        name="wall">
        {{ $t('GROUP.WALL') }}
      </q-route-tab>
      <q-route-tab
        :to="{name: 'groupDescription'}"
        exact
        slot="title"
        name="description">
        {{ $t('GROUP.DESCRIPTION') }}
      </q-route-tab>
      <q-route-tab
        :to="{name: 'groupHistory'}"
        exact
        slot="title"
        name="history">
        {{ $t('GROUP.HISTORY') }}
      </q-route-tab>
    </q-tabs>
    <q-btn flat class="bg-tertiary text-white">
      <q-icon name="fa-ellipsis-v" />
      <GroupOptions/>
    </q-btn>
  </div>
</template>

<script>
import { QTabs, QRouteTab, QBtn, QIcon } from 'quasar'
import GroupOptions from '@/components/Sidenav/GroupOptions'

export default {
  components: { QTabs, QRouteTab, QBtn, QIcon, GroupOptions },
}
</script>

<style scoped lang="stylus">
</style>
