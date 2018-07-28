<template>
  <q-tabs
    align="center"
    class="mobileNavigation"
  >
    <KTab
      slot="title"
      :to="{name: 'group', params: {groupId: currentGroupId}}"
      name="group"
    >
      <template slot="icon">
        <i class="fas fa-home q-tab-icon" />
      </template>
      <template>
        {{ $t('GROUP.GROUP') }}
      </template>
    </KTab>

    <KTab
      slot="title"
      :to="{name: 'groupPickups', params: {groupId: currentGroupId}}"
      name="pickups"
    >
      <template slot="icon">
        <i class="fas fa-shopping-basket q-tab-icon" />
      </template>
      <template>
        {{ $t('GROUP.PICKUPS') }}
      </template>
    </KTab>

    <KTab
      slot="title"
      :to="{name: 'stores', params: {groupId: currentGroupId}}"
      name="stores"
    >
      <template slot="icon">
        <i class="fas fa-shopping-cart q-tab-icon" />
      </template>
      <template>
        {{ $t('GROUP.STORES') }}
      </template>
    </KTab>

    <KTab
      slot="title"
      :to="{name: 'map', params: {groupId: currentGroupId}}"
      name="profile"
    >
      <template slot="icon">
        <i class="fas fa-map q-tab-icon" />
      </template>
      <template class="q-tab-label">
        {{ $t('GROUPMAP.TITLE') }}
      </template>
    </KTab>
  </q-tabs>
</template>
<script>

import { QTabs, QTab, QIcon } from 'quasar'
import KTab from './KTab'
export default {
  components: { QTabs, QTab, QIcon, KTab },
  props: {
    currentGroupId: {
      type: Number,
      default: null,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.mobileNavigation
  margin-bottom -2px
  transition color 10s ease-out
  .q-router-link-active
    opacity 1
    >>> .label
      opacity 1
</style>
