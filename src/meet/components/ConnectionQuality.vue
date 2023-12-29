<template>
  <div
    class="connection-quality"
    :title="connectionQuality"
  >
    <div
      v-for="bar in [1,2,3]"
      :key="bar"
      class="bg-white"
      :style="{ opacity: rating < bar ? 0.3 : 0.8 }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  connectionQuality: {
    type: String,
    default: 'unknown',
  },
})

const rating = computed(() => {
  const idx = [
    'lost',
    'poor',
    'good',
    'excellent',
  ].indexOf(props.connectionQuality)
  return idx !== -1 ? idx : 0
})
</script>

<style scoped lang="sass">
.connection-quality
  display: flex
  align-items: flex-end
  gap: 1px
  width: 14px
  height: 14px

  *
    flex: 1 0 auto

  *:nth-child(1)
    height: 33%

  *:nth-child(2)
    height: 66%

  *:nth-child(3)
    height: 100%

</style>
