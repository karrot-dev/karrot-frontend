<template>
  <QBtn
    class="row no-wrap items-center"
    dense
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
  min-height 23px
  padding 0px 3px
  line-height 31px

  >>> .q-btn__wrapper
    min-height 0
    padding 0

.emoji
  >>> img.emoji
    width 1em
    height 1em
    margin .1em .1em
    vertical-align middle
</style>
