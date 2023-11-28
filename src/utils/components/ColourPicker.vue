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
      <QColor
        v-model="colour"
        style="width: 350px; max-width: 100%;"
        format-model="hex"
        no-footer
        no-header
        default-view="palette"
        :palette="paletteColours"
        square
        flat
      />
    </QMenu>
  </QBtn>
</template>
<script setup>
import { QBtn, QColor, QMenu } from 'quasar'
import { computed } from 'vue'

import paletteColours, { defaultColour } from '@/utils/paletteColours'

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
