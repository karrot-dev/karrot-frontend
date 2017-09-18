<template>
  <div>
    <PickupList :pickups="pickups"></PickupList>
  </div>
</template>

<script>
import PickupList from '@/components/Pickups/PickupList'

import {
  mapGetters,
} from 'vuex'

import { QCard, QTabs, QRouteTab } from 'quasar'

export default {
  components: { PickupList, QCard, QTabs, QRouteTab },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
    pickups () {
      console.log(this.store)
      return []
    },
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
