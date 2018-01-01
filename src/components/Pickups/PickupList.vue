<template>
  <div>
    <PickupItem
      v-for="pickup in pickups"
      :key="pickup.id"
      :pickup="pickup"
      @join="$emit('join', arguments[0])"
      @leave="$emit('leave', arguments[0])"
    >
      {{ $d(pickup.date, 'dateLongWithDayName') }}
    </PickupItem>
  </div>
</template>

<script>
import PickupItem from './PickupItem'

export default {
  props: {
    pickups: { required: true },
  },
  components: {
    PickupItem,
  },
}
</script>

<style scoped lang="stylus">
</style>
