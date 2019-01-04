<template>
  <QBtn
    @click="$emit('click')"
    class="row no-wrap items-center"
    flat
  >
    <div
      class="emoji"
      ref="emoji"
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
  mounted () {
    this.$refs.emoji.appendChild(this.emojiElement)
  },
  watch: {
    emojiElement (emojiElement, prevEmojiElement) {
      this.$refs.emoji.replaceChild(emojiElement, prevEmojiElement)
    },
  },
  computed: {
    emojiElement () {
      return getEmojiElement(this.name)
    },
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
