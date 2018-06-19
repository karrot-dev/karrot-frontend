<template>
  <div>
    <transition name="slide-toggle">
      <transition-group
        name="list"
        tag="div"
      >
        <PickupItem
          v-for="pickup in pickups"
          :key="pickup.id"
          :pickup="pickup"
          :store-link="storeLink"
          @join="$emit('join', arguments[0])"
          @leave="$emit('leave', arguments[0])"
        />
      </transition-group>
    </transition>
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
    storeLink: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PickupItem,
  },
}
</script>

<style scoped lang="stylus">
@import '~slidetoggle'
.list-leave-active
  transition: all .5s
.list-leave-to
  opacity: 0
  transform: translateX(-50px)
</style>
