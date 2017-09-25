<template>
    <div>
      <q-card color="secondary" class="generic-padding">
        <i class="fa fa-exclamation-triangle on-left"/>
        {{ $tc('PICKUPLIST.EMPTYNOTICE', pickups.length, { count: pickups.length})}}
      </q-card>
      <transition-group name="list" tag="div">
        <PickupItem v-for="pickup in pickups"
                    :key="pickup.id"
                    :pickup="pickup"
                    @join="$emit('join', arguments[0])"
                    @leave="$emit('leave', arguments[0])">
          <strong>{{ pickup.store.name }}</strong> {{ $d(pickup.date, 'dateShort') }}
        </PickupItem>
      </transition-group>
    </div>
</template>

<script>
import PickupItem from '../Pickups/PickupItem.vue'
import { QCard } from 'quasar'

export default {
  components: { PickupItem, QCard },
  props: {
    pickups: { required: true },
  },
}
</script>

<style scoped lang="stylus">
.list-leave-active
  transition: all .5s
.list-leave-to
  opacity: 0
  transform: translateX(-50px)
</style>
