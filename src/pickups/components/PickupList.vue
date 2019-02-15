<template>
  <div>
    <PickupItem
      v-for="pickup in pickups"
      :key="pickup.id"
      :pickup="pickup"
      :place-link="placeLink"
      @join="$emit('join', arguments[0])"
      @leave="$emit('leave', arguments[0])"
      @detail="$emit('detail', arguments[0])"
    />
  </div>
</template>

<script>
import PickupItem from './PickupItem'

export default {
  props: {
    pickups: {
      type: Array,
      required: true,
    },
    placeLink: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PickupItem,
  },
}
</script>
