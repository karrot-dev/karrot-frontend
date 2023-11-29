<template>
  <QBtn
    :label="$t('BUTTON.CHANGE_COLOUR')"
    flat
    color="primary"
  >
    <QMenu
      auto-close
      square
    >
      <div
        v-for="(row, idx) in rows"
        :key="idx"
        style="max-width: 100%;"
        :style="{ width: `${row.length * 35}px` }"
        class="flex"
      >
        <div
          v-for="entry in row"
          :key="entry"
          class="col-grow cursor-pointer"
          :class="`bg-${entry.name}`"
          style="aspect-ratio: 1;"
          @click="colour = entry.hex"
        />
      </div>
    </QMenu>
  </QBtn>
</template>
<script setup>
import { QBtn, QMenu } from 'quasar'
import { computed } from 'vue'

import { defaultColour, rows } from '@/utils/paletteColours'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

if (!props.modelValue) {
  emit('update:modelValue', defaultColour.substring(1))
}

const colour = computed({
  get () {
    return props.modelValue ? `#${props.modelValue}` : null
  },
  set (val) {
    emit('update:modelValue', val?.substring(1))
  },
})

</script>
