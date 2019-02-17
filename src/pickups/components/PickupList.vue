<template>
  <div>
    <div
      v-show="pending"
      style="width: 100%; text-align: center"
    >
      <QSpinnerDots :size="40"/>
    </div>
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
import {
  QSpinnerDots,
} from 'quasar'

export default {
  components: {
    PickupItem,
    QSpinnerDots,
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
