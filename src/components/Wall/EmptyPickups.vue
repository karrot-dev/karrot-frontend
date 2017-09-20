<template>
    <div>
      <q-card color="secondary" class="generic-padding">
        <i class="fa fa-exclamation-triangle on-left"/>
        There are {{pickups.length}} Empty Pickups in the next days waiting for you!
      </q-card>
      <PickupItem v-for="pickup in pickups" :key="pickup.id" :pickup="pickup">
        <strong>{{ pickup.store.name }}</strong> {{ $d(pickup.date, 'dateShort') }}
      </PickupItem>
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
</style>
