<template>
  <div>
    <PickupList :pickups="pickups"></PickupList>
    <KNotice v-if="pickups && pickups.length == 0" >
      <template slot="icon">
        <i class="fa fa-bed"/>
      </template>
      {{ $t('PICKUPLIST.NONE') }}
      <template slot="desc">
        {{ $t('PICKUPLIST.NONE_HINT') }}
      </template>
    </KNotice>
  </div>
</template>

<script>
import PickupList from '@/components/Pickups/PickupList'
import KNotice from '@/components/General/KNotice'

import {
  mapGetters,
} from 'vuex'

import { QCard, QTabs, QRouteTab } from 'quasar'

export default {
  components: { PickupList, QCard, QTabs, QRouteTab, KNotice },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
      pickups: 'pickups/filtered',
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
.notice
  .icon
    font-size 4rem
    margin .1em 0 0 0
  padding 2em 3em
  transform: translateZ(1px) rotate(-3deg);
  h5
    padding 0
</style>
