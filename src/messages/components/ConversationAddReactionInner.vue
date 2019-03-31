<template>
  <div
    class="row"
    style="margin: 2px 4px"
  >
    <EmojiButton
      v-for="name in whitelist"
      :key="name"
      v-close-overlay
      :name="name"
      class="big"
      :title="':' + name + ':'"
      @click.native="$emit('toggle', name)"
    />
  </div>
</template>

<script>
import EmojiButton from './EmojiButton'

export default {
  components: { EmojiButton },
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
