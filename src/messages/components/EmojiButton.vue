<template>
  <QBtn
    class="row no-wrap items-center"
    flat
    @click="$emit('click')"
  >
    <div
      ref="emoji"
      class="emoji"
    />
    <slot />
  </QBtn>
</template>

<script>
import { QBtn } from 'quasar'
import emojiList from 'markdown-it-emoji/lib/data/full.json'
import twemoji from 'twemoji'

const EMOJI_CACHE = {}
function getEmojiElement (name) {
  const cached = EMOJI_CACHE[name]
  if (cached) return EMOJI_CACHE[name].cloneNode(true)
  const container = document.createElement('div')
  container.innerHTML = twemoji.parse(emojiList[name])
  const el = container.firstChild
  EMOJI_CACHE[name] = el
  return el
}

export default {
  components: { QBtn },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    emojiElement () {
      return getEmojiElement(this.name)
    },
  },
  watch: {
    emojiElement (emojiElement, prevEmojiElement) {
      this.$refs.emoji.replaceChild(emojiElement, prevEmojiElement)
    },
  },
  mounted () {
    this.$refs.emoji.appendChild(this.emojiElement)
  },
}
</script>

<style scoped lang="stylus">
.q-btn
  padding 1px 3px
  min-height 23px
.emoji
  >>> img.emoji
    height 1em
    width 1em
    margin .1em .1em
    vertical-align middle
</style>
