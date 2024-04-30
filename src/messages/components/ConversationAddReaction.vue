<template>
  <QBtn
    :outline="$attrs.outline"
    :flat="$attrs.flat"
    :unelevated="$attrs.unelevated"
    :color="$attrs.color"
    :text-color="$attrs.textColor"
  >
    <span :style="{opacity}">
      <i class="far fa-smile" /> +
    </span>
    <QMenu
      anchor="top left"
      self="top left"
    >
      <div style="width: 195px">
        <ConversationAddReactionInner
          :reacted="reacted"
          @toggle="(...args) => $emit('toggle', ...args)"
        />
      </div>
    </QMenu>
  </QBtn>
</template>

<script setup>
import {
  QBtn,
  QMenu,
} from 'quasar'
import { defineAsyncComponent } from 'vue'

const ConversationAddReactionInner = defineAsyncComponent(() => import('./ConversationAddReactionInner.vue'))

defineProps({
  opacity: {
    type: Number,
    default: 1,
  },
  reacted: {
    type: Array,
    default: () => [],
  },
})

defineEmits([
  'toggle',
])
</script>
