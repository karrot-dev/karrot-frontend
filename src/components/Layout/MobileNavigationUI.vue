<template>
  <q-tabs v-model="selectedTab" align="center" class="mobileNavigation">
    <KTab slot="title" :to="{name: 'group', params: {groupId: activeGroupId}}" name="group">
      <template slot="icon"><i class="fa fa-home q-tab-icon" /></template>
      <template>{{ $t('GROUP.GROUP') }}</template>
    </KTab>
    <KTab slot="title" :to="{name: 'groupPickups', params: {groupId: activeGroupId}}" name="pickups">
      <template slot="icon"><i class="fa fa-shopping-basket q-tab-icon" /></template>
      <template>{{ $t('GROUP.PICKUPS') }}</template>
    </KTab>
    <KTab slot="title" :to="{name: 'stores', params: {groupId: activeGroupId}}" name="stores">
      <template slot="icon"><i class="fa fa-shopping-cart q-tab-icon" /></template>
      <template>{{ $t('GROUP.STORES') }}</template>
    </KTab>
    <KTab slot="title" :to="{name: 'map', params: {groupId: activeGroupId}}" name="profile">
      <template slot="icon"><i class="fa fa-map q-tab-icon" /></template>
      <template class="q-tab-label">{{ $t('GROUPMAP.TITLE') }}</template>
    </KTab>
  </q-tabs>
</template>
<script>

import { QTabs, QTab, QIcon, QChip } from 'quasar'
import KTab from './KTab'
export default {
  components: { QTabs, QTab, QIcon, QChip, KTab },
  data () {
    return {
      // initializing for second tab to be selected by default
      selectedTab: 'group',
    }
  },
  props: {
    activeGroupId: { required: true },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.mobileNavigation
  margin-bottom -2px
  transition: color  10s ease-out
  .router-link-active
    color $tertiary
.ktab
  transition:  color  .3s ease-out
.fa
  transition:  font-size .3s ease-out
  font-size 1.4em
</style>
