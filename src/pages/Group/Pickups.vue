<template>
  <div>
    <PickupItem
      v-for="pickup in pickups"
      :key="pickup.id"
      :pickup="pickup"
      @join="$emit('join', arguments[0])"
      @leave="$emit('leave', arguments[0])"
      >
      <strong v-if="pickup.store">
        <router-link :to="{ name: 'store', params: { storeId: pickup.store.id }}">{{ pickup.store.name }}</router-link>
      </strong> {{ $d(pickup.date, 'dateWithDayName') }}
    </PickupItem>
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
import PickupItem from '@/components/Pickups/PickupItem'
import KNotice from '@/components/General/KNotice'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { PickupItem, KNotice },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
    }),
  },
  computed: {
    ...mapGetters({
      pickups: 'pickups/all',
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
.manage
  padding 8px
  q-btn
    display inline-block
    padding .3em
</style>
