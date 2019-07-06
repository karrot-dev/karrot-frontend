<template>
  <QBtn flat>
    <span :style="{opacity}">
      <i class="far fa-smile" /> +
    </span>
    <QMenu
      anchor="top left"
      self="top left"
      @show="open = true"
      @hide="open = false"
    >
      <div style="width: 195px">
        <ConversationAddReactionInner
          v-if="open"
          :reacted="reacted"
          @toggle="$emit('toggle', arguments[0])"
        />
      </div>
    </QMenu>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QMenu,
} from 'quasar'

const ConversationAddReactionInner = () => import('./ConversationAddReactionInner')

export default {
  components: {
    QBtn,
    QMenu,
    ConversationAddReactionInner,
  },
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
    }
  },
}
</script>
