<template>
  <div>
    <q-card class="no-shadow grey-border">
      <div class="generic-padding overflow" v-if="store.description">
        <Markdown v-if="store.description" :source="store.description" />
      </div>
      <q-tabs align="center" color="tertiary" class="shadow-14 inset-shadow" hide="icon" slot="navigation">
        <q-route-tab
            :to="{name: 'storePickups'}"
            exact
            slot="title"
            name="pickups"
        >{{ $t('GROUP.PICKUPS' )}}</q-route-tab>
        <q-route-tab
            :to="{name: 'storeHistory'}"
            exact
            slot="title"
            name="history"
        >{{ $t('GROUP.HISTORY' )}}</q-route-tab>
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
.overflow
  overflow-y auto
  max-height 120px
</style>
