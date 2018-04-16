<template>
  <q-btn flat>
    <span style="opacity: .5">
      <i class="far fa-smile" /> +
    </span>
    <q-popover
      anchor="top left"
      self="top left"
    >
      <div
        class="row"
        style="margin: 2px 4px"
      >
        <EmojiButton
          v-for="name in whitelist"
          :key="name"
          :name="name"
          @click.native="$emit('toggle', name)"
          class="big"
          tooltip
          v-close-overlay
        />
      </div>
    </q-popover>
  </q-btn>
</template>

<script>
import EmojiButton from './EmojiButton'
import { QBtn, QPopover } from 'quasar'

export default {
  components: { QBtn, QPopover, EmojiButton },
  props: {
    reacted: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    whitelist () {
      // sorted alphabetically
      return [
        'carrot',
        'laughing',
        'ok_hand',
        'thumbsup',
        'thumbsdown',
      ].filter(e => !this.reacted.includes(e))
    },
  },
}
</script>

<style scoped lang="stylus">
.big
  font-size 1.6em
</style>
