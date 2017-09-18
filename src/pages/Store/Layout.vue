<template>
  <div>
    <q-card class="no-shadow card grey-border" style="width: 100%">
      <div class="padding">{{ store.description }}</div>
      <q-tabs align="center" color="tertiary" class="shadow-14 inset-shadow" hide="icon" slot="navigation">
        <q-route-tab
            :to="{name: 'store'}"
            exact
            slot="title"
            name="wall"
        >Wall</q-route-tab>
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

import { QCard, QTabs, QRouteTab } from 'quasar'

export default {
  components: { QCard, QTabs, QRouteTab },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
  },
  metaInfo () {
    if (this.store) {
      return {
        title: this.store.name,
      }
    }
    else {
      return {}
    }
  },
}
</script>

<style scoped lang="stylus">
.card
  margin 0
.padding
  padding 1em
</style>
