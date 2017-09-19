<template>
    <q-tabs v-model="selectedTab" align="center" class="mobileNavigation">
      <KTab slot="title" to="/group/1" name="group">
        <template slot="icon"><i class="fa fa-home q-tab-icon"></i></template>
        <template>{{$t('GROUP.GROUP')}}</template>
      </KTab>
      <KTab slot="title" to="/group/1/store" name="stores">
        <template slot="icon"><i class="fa fa-shopping-cart q-tab-icon"></i></template>
        <template>{{$t('GROUP.STORES')}}</template>
      </KTab>
      <KTab slot="title" :to="{name: 'map', params: {groupId: 1}}" name="profile">
        <template slot="icon"><i class="fa fa-map q-tab-icon"></i></template>
        <template class="q-tab-label">{{$t('GROUPMAP.TITLE')}}</template>
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
}
</script>

<style scoped lang="stylus">
.mobileNavigation
  margin-bottom -2px
.fa
  font-size 1.4em
</style>
