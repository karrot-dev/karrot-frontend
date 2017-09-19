<template>
  <div>
    <h5>History</h5>
    <q-card color="info" class="generic-padding">
      <i class="fa fa-exclamation-triangle on-left"/>
      Waiting to be filled with information...
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
