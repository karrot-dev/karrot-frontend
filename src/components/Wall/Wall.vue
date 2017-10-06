<template>
  <div class="wrapper">
    <div class="notices" v-if="emptyPickups.length > 0">
      <EmptyPickups :pickups="emptyPickups" @join="$emit('join', arguments[0])" @leave="$emit('leave', arguments[0])"/>
    </div>
    <div>
      <h5 class="generic-padding wall-header">Wall</h5>
    </div>
    <WallInput @send="$emit('send', arguments[0])" />
    {{ messageReceiveStatus.error }}
    <WallMessage v-for="message in messages" :key="message.id" :message="message"/>
    <button class="more" @click="$emit('fetchMoreMessages')">fetch more messages</button>
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
    emptyPickups: { required: false, default: () => [] },
    messageReceiveStatus: { default: () => ({}) },
  },
}
</script>

<style scoped lang="stylus">
.notices
  margin-top .5em
  margin-bottom 3em
.wall-header
  margin-bottom 0
</style>
