<template>
  <div class="wrapper">
    <div class="notices">
      notices
    </div>
    <hr/>
    <div>
      <h3>Wall</h3>
    </div>
    <WallMessage v-for="message in messages" :key="message.id" :message="message"/>
  </div>
</template>

<script>
import WallMessage from './WallMessage.vue'

export default {
  components: {
    WallMessage
  },
  props: {
    messages: { required: true }
  }
}
</script>

<style scoped lang="stylus">
</style>