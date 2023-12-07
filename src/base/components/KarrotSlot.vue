<template>
  <Root />
</template>

<script setup>
import { h, ref, useAttrs, useSlots, watchEffect } from 'vue'

import { getPluginSlotComponents } from '@/boot/plugins'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

defineOptions({
  inheritAttrs: false,
})

const slots = useSlots()
const attrs = useAttrs()

const components = ref([])

watchEffect(async () => {
  components.value = await getPluginSlotComponents(props.name)
})

function Root () {
  const startNode = slots.default ? h(slots.default, attrs) : null
  return components.value.reduce((node, component) => {
    return h(component, attrs, { default: node })
  }, startNode)
}
</script>
