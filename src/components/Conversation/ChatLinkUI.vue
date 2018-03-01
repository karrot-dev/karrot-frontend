<template>
  <router-link :to="$q.platform.is.desktop ? '' : {name: 'chatDetail', params: { userId }}">
    <q-btn
      class="comment-button"
      @click="$emit('addFloater', userId)"
      :flat="flat"
      :color="color"
      :small="small">
      <slot />
    </q-btn>
  </router-link>
</template>

<script>
import { QBtn } from 'quasar'
export default {
  components: { QBtn },
  props: {
    userId: {
      type: Number,
      required: true,
    },
    color: { type: String, default: 'chat' },
    flat: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.comment-button:hover
  color $chat
</style>
