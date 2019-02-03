<template>
  <div>
    <Transition name="slide-toggle">
      <TransitionGroup
        name="list"
        tag="div"
      >
        <PickupItem
          v-for="pickup in pickups"
          :key="pickup.id"
          :pickup="pickup"
          :place-link="placeLink"
          @join="$emit('join', arguments[0])"
          @leave="$emit('leave', arguments[0])"
          @detail="$emit('detail', arguments[0])"
        />
      </TransitionGroup>
    </Transition>
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

<style scoped lang="stylus">
@import '~slidetoggle'
.list-leave-active
  transition: all .5s
.list-leave-to
  opacity: 0
  transform: translateX(-50px)
</style>
