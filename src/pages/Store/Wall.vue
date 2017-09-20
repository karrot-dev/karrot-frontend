<template>
  <div>
    <h5 class="generic-padding">Wall</h5>
    <q-card color="info" class="generic-padding">
      <i class="fa fa-exclamation-triangle on-left"/>
      Basically waiting for backend since
      stores don't have walls yet
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
}
</script>

<style scoped lang="stylus">
.card
  margin 0
.padding
  padding 1em
</style>
