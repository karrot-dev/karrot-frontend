<template>
  <div>
    <Root v-if="components.length > 0" />
    <slot v-else />
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

import { karrotPlugins } from '@/boot/plugins'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const components = computed(() => {
  const entries = []
  for (const plugin of karrotPlugins) {
    if (plugin?.slots[props.name]) {
      const def = plugin.slots[props.name]
      if (typeof def === 'function') {
        entries.push(def())
      }
      else {
        entries.push(def)
      }
    }
  }
  return entries
})

const Root = computed(() => {
  if (!components.value) return null
  return h('div', components.value.map(entry => h(entry)))
})
</script>
