<template>
  <q-btn flat>
    <span style="opacity: .5">
      <i class="far fa-smile" /> +
    </span>
    <q-popover
      anchor="top left"
      self="top left"
      @show="open = true"
      @hide="open = false"
    >
      <ConversationAddReactionInner
        v-if="open"
        :reacted="reacted"
        @toggle="$emit('toggle', arguments[0])"
      />
    </q-popover>
  </q-btn>
</template>

<script>
import { QBtn, QPopover } from 'quasar'

const ConversationAddReactionInner = () => import('./ConversationAddReactionInner')

export default {
  components: { QBtn, QPopover, ConversationAddReactionInner },
  props: {
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
