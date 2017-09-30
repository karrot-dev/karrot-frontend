<template>
  <div>
    <q-card class="no-shadow grey-border" style="width: 100%">
      <q-scroll-area style="height: 120px;">
        <div class="generic-padding">
          <Markdown v-if="store.description" :source="store.description" />
        </div>
      </q-scroll-area>
      <q-tabs align="center" color="tertiary" class="shadow-14 inset-shadow" hide="icon" slot="navigation">
        <!--<q-route-tab
            :to="{name: 'store'}"
            exact
            slot="title"
            name="wall"
        >Wall</q-route-tab>-->
        <q-route-tab
            :to="{name: 'storePickups'}"
            exact
            slot="title"
            name="pickups"
        >Pickups</q-route-tab>
        <q-route-tab
            :to="{name: 'storeHistory'}"
            exact
            slot="title"
            name="history"
        >History</q-route-tab>
      </q-tabs>
    </q-card>
    <router-view></router-view>
  </div>
</template>

<script>

import {
  mapGetters,
} from 'vuex'
import Markdown from '@/components/Markdown.vue'

import { QCard, QTabs, QRouteTab, QScrollArea } from 'quasar'

export default {
  components: { QCard, QTabs, QRouteTab, QScrollArea, Markdown },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
