<template>
    <div>
      <h5>Empty Pickups:</h5>
      <PickupItem v-for="pickup in pickups" :key="pickup.id" :pickup="pickup">
        <strong>{{ pickup.store.name }}</strong> {{ $d(pickup.date, 'dateShort') }}
      </PickupItem>
    </div>
</template>

<script>
import PickupItem from '../Pickups/PickupItem.vue'

export default {
  components: { PickupItem },
  props: {
    pickups: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
