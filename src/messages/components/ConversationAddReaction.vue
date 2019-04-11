<template>
  <QBtn flat>
    <span :style="{opacity}">
      <i class="far fa-smile" /> +
    </span>
    <QPopover
      anchor="top left"
      self="top left"
      @show="open = true"
      @hide="open = false"
    >
      <p>{{ search }}</p>
      <QSearch
        v-model="search"
      />
      <ConversationAddReactionInner
        v-if="open"
        :reacted="reacted"
        :search="search"
        @toggle="$emit('toggle', arguments[0])"
      />
    </QPopover>
  </QBtn>
</template>

<script>
import { QBtn, QPopover, QSearch } from 'quasar'

const ConversationAddReactionInner = () => import('./ConversationAddReactionInner')

export default {
  components: { QBtn, QPopover, QSearch, ConversationAddReactionInner },
  props: {
    opacity: {
      type: Number,
      default: 1,
    },
    reacted: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      open: false,
      search: '',
    }
  },
}
</script>
