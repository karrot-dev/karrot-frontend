<template>
  <div class="wrapper">
    <div class="notices">
      <EmptyPickups :pickups="emptyPickups"/>
    </div>
    <hr/>
    <div>
      <h5>Wall</h5>
    </div>
    <WallMessage v-for="message in messages" :key="message.id" :message="message"/>
  </div>
</template>

<script>
import WallMessage from './WallMessage.vue'
import EmptyPickups from './EmptyPickups.vue'

export default {
  components: {
    WallMessage,
    EmptyPickups,
  },
  props: {
    messages: { required: true },
    emptyPickups: { required: false },
  },
}
</script>

<style scoped lang="stylus">
</style>