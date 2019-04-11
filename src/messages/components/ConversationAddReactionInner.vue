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
import emojiList from 'markdown-it-emoji/lib/data/full.json'

function searchEmoji (search) {
  // clean search by removing colons and setting lowercase
  let cleanedSearch = search.replace(/:/g, '').toLowerCase()
  // only considers exact match searches
  if (Object.keys(emojiList).includes(cleanedSearch)) {
    return [cleanedSearch]
  }
  else {
    return []
  }
}

export default {
  components: { EmojiButton },
  props: {
    reacted: {
      type: Array,
      default: () => [],
    },
    search: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    whitelist () {
      // sorted alphabetically
      if (this.search !== '') {
        return searchEmoji(this.search).filter(e => !this.reacted.includes(e))
      }
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
