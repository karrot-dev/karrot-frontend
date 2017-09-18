<template>
    <q-tabs v-model="selectedTab" align="center" class="mobileNavigation">
      <KTab slot="title" to="/group/1" name="group">
        <template slot="icon"><i class="fa fa-home q-tab-icon"></i></template>
        <template>Wall</template>
      </KTab>
      <KTab slot="title" to="/group/1/store" name="stores">
        <template slot="icon"><i class="fa fa-shopping-cart q-tab-icon"></i></template>
        <template>Stores</template>
      </KTab>
      <KTab slot="title" name="messages">
        <template slot="icon"><i class="fa fa-comment q-tab-icon"></i></template>
        <template>Chat</template>
      </KTab>
      <KTab slot="title" name="notifications">
        <template slot="icon"><i class="fa fa-bell q-tab-icon"></i></template>
        <template>Alerts</template>
      </KTab>
      <KTab slot="title" :to="{name: 'map', params: {groupId: 1}}" name="profile">
        <template slot="icon"><i class="fa fa-map q-tab-icon"></i></template>
        <template class="q-tab-label">Map</template>
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
</style>
