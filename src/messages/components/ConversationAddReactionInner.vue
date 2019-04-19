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
  // Remove colons and set to lowercase to normalize search
  let cleanedSearch = search.replace(/:/g, '').toLowerCase()
  let matchingEmojiNames = []
  // The set is used to remove duplicate emoji that may have different names
  let matchingEmojiUnicodes = new Set()
  // First add the exact search in case there is an emoji shortcode with less
  // than three characters
  if (Object.keys(emojiList).includes(cleanedSearch)) {
    matchingEmojiUnicodes.add(emojiList[cleanedSearch])
    matchingEmojiNames.push(cleanedSearch)
  }

  // Checks the length because we don't want to have too many results
  if (cleanedSearch.length > 2) {
    for (var index in Object.keys(emojiList)) {
      // This regular expression does a substring search of emoji names to
      // find more interesting results
      let regexp = '.*' + cleanedSearch + '.*'
      let emojiShortcode = Object.keys(emojiList)[index]
      if (emojiShortcode.match(regexp) &&
          emojiShortcode !== cleanedSearch &&
          !matchingEmojiUnicodes.has(emojiList[emojiShortcode])) {
        matchingEmojiUnicodes.add(emojiList[emojiShortcode])
        matchingEmojiNames.push(emojiShortcode)
      }
      if (matchingEmojiNames.length >= 20) {
        return matchingEmojiNames
      }
    }
  }
  return matchingEmojiNames
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
