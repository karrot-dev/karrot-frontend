<template>
  <div>
    <KSpinner v-show="pending" />
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
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    PickupItem,
    KSpinner,
  },
  props: {
    pickups: {
      type: Array,
      required: true,
    },
    placeLink: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
