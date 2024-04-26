<template>
  <div>
    <QResizeObserver
      style="width: 100%"
      @resize="onResize"
    />
    <GroupGalleryCard
      v-for="group in groups"
      :key="group.id"
      :style="cardStyle"
      :group="group"
    />
  </div>
</template>

<script setup>
import { QResizeObserver } from 'quasar'
import { computed, ref } from 'vue'

import GroupGalleryCard from './GroupGalleryCard.vue'

defineProps({
  groups: {
    default: () => [],
    type: Array,
  },
})

const width = ref(230)

const cols = computed(() => Math.max(1, Math.floor(width.value / 230)))
const cardStyle = computed(() => ({ width: (100 / cols.value) + '%' }))

function onResize ({ width: value }) {
  width.value = value
}
</script>
