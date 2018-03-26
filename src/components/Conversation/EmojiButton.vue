<template>
  <q-btn
    @click="$emit('click')"
    class="row no-wrap items-center"
    flat
  >
    <div
      class="emoji"
      v-html="picture(name)"
    />
    <slot />
    <q-tooltip
      :disable="!tooltip || $q.platform.is.mobile"
      :delay="500"
    >
      :{{ name }}:
    </q-tooltip>
  </q-btn>
</template>

<script>
import { QBtn, QTooltip } from 'quasar'
import emojiList from 'markdown-it-emoji/lib/data/full.json'
import twemoji from 'twemoji'

export default {
  components: { QBtn, QTooltip },
  props: {
    name: {
      type: String,
      required: true,
    },
    tooltip: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    picture (name) {
      return twemoji.parse(emojiList[name])
    },
  },
}
</script>

<style scoped lang="stylus">
.q-btn
  padding 1px 3px
  min-height 0
.emoji
  >>> img.emoji
    height 1em
    width 1em
    margin .1em .1em
    vertical-align middle
</style>
