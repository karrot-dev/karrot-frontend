<template>
  <div
    class="row"
    style="margin: 2px 4px; width: 185px"
  >
    <QSearch
      v-model="search"
    />
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
import { QSearch } from 'quasar'

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
  components: { EmojiButton, QSearch },
  props: {
    reacted: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      search: '',
    }
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
        'rage',
        'cry',
        'heart',
        'muscle',
        'raised_hands',
      ].filter(e => !this.reacted.includes(e))
    },
  },
}
</script>

<style scoped lang="stylus">
.big
  font-size 1.6em
</style>
