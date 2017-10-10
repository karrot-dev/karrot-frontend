<template>
  <div>
    <PickupList :store="store" :pickups="pickups" @join="join" @leave="leave"></PickupList>
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
  mapActions,
} from 'vuex'

import { QCard, QTabs, QRouteTab } from 'quasar'

export default {
  components: { PickupList, QCard, QTabs, QRouteTab, KNotice },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
    }),
  },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
      pickups: 'pickups/filtered',
    }),
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
    margin .1em 0 0 0
    .fa
      font-size 10vw
  padding 2em 3em
  transform: translateZ(1px) rotate(-3deg);
  h5
    padding 0
</style>
