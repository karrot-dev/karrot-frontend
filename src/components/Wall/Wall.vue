<template>
  <div class="wrapper">
    <div class="notices" v-if="emptyPickups.length > 0">
      <EmptyPickups :pickups="emptyPickups" @join="$emit('join', arguments[0])" @leave="$emit('leave', arguments[0])"/>
    </div>
    <div>
      <h5 class="generic-padding">Wall</h5>
    </div>
    <WallInput @send="$emit('send', arguments[0])" />
    <WallMessage v-for="message in messages" :key="message.id" :message="message"/>
  </div>
</template>

<script>
import WallMessage from './WallMessage.vue'
import EmptyPickups from './EmptyPickups.vue'
import WallInput from './WallInput.vue'

export default {
  components: {
    WallMessage,
    EmptyPickups,
    WallInput,
  },
  props: {
    messages: { required: true },
    emptyPickups: { required: false },
  },
}
</script>

<style scoped lang="stylus">
</style>
