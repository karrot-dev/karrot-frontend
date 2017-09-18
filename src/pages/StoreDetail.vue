<template>
  <div>
    <q-card class="no-shadow grey-border" style="width: 100%">
      <div class="padding">{{ store.description }}</div>
      <q-tabs align="center" color="tertiary" class="shadow-14 inset-shadow" hide="icon" slot="navigation">
        <q-route-tab
            :to="{name: 'group'}"
            exact
            slot="title"
            name="wall"
        >Wall</q-route-tab>
        <q-route-tab
            :to="{name: 'group'}"
            exact
            slot="title"
            name="wall"
        >Pickups</q-route-tab>
        <q-route-tab
            :to="{name: 'groupDescription'}"
            exact
            slot="title"
            name="description"
        >History</q-route-tab>
      </q-tabs>
    </q-card>
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
.padding
  padding 1em
</style>
