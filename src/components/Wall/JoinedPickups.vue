<template>
  <div>
    <q-card @click="showPickups = !showPickups" color="secondary" class="generic-padding notice">
      <i class="fa fa-shopping-basket on-left"/>
      {{ $tc('PICKUPLIST.JOINEDNOTICE', pickups.length, { count: pickups.length })}}
      <div class="card-arrow" v-bind:class="{ upsideDown: showPickups }">
        <i class="fa fa-arrow-circle-down"/>
      </div>
    </q-card>
    <transition-group name="list" tag="div" v-if="showPickups">
      <PickupItem
        v-for="pickup in pickups"
        :key="pickup.id"
        :pickup="pickup"
        @join="$emit('join', arguments[0])"
        @leave="$emit('leave', arguments[0])"
        >
        <strong v-if="pickup.store">{{ pickup.store.name }}</strong> {{ $d(pickup.date, 'dateShort') }}
      </PickupItem>
    </transition-group>
    <hr v-if="showPickups">
  </div>
</template>

<script>
import PickupItem from '@/components/Pickups/PickupItem'
import { QCard } from 'quasar'

export default {
  components: { PickupItem, QCard },
  props: {
    pickups: { required: true },
  },
  data () {
    return {
      showPickups: true,
    }
  },
}
</script>

<style scoped lang="stylus">
.list-leave-active
  transition: all .5s
.list-leave-to
  opacity: 0
  transform: translateX(-50px)
.q-card.notice
  cursor pointer
  transition: all .2s ease;
  .card-arrow
    float: right
    transition: all .3s ease;
  .upsideDown
    transform rotate(180deg)
.q-card.notice:hover
  box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.4)
hr
  margin 1em 2em
  border solid lightgrey 1px;
</style>
