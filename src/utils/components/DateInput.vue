<template>
  <QInput
    ref="field"
    v-model="value"
    mask="####-##-##"
    size="9"
    hide-bottom-space
    outlined
    class="q-mr-sm"
    v-bind="$attrs"
    @focus="focus"
    @clear="() => $refs.proxy.hide()"
  >
    <Component
      :is="smallScreen ? QDialog : QMenu"
      ref="proxy"
      no-focus
      no-refocus
      no-parent-event
      @hide="$refs.field.blur()"
    >
      <QDate
        v-model="value"
        mask="YYYY-MM-DD"
        @update:model-value="() => smallScreen && $refs.proxy.hide()"
      />
    </Component>
  </QInput>
</template>
<script setup>
import {
  QInput,
  QDialog,
  QMenu,
  QDate,
  Screen, date,
} from 'quasar'
import { computed, ref } from 'vue'

const proxy = ref('proxy')

const smallScreen = computed(() => Screen.width < 450 || Screen.height < 450)

const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
})

const emit = defineEmits([
  'update:model-value',
])

const value = computed({
  get () {
    return date.formatDate(props.modelValue, 'YYYY-MM-DD')
  },
  set (val) {
    if (val) {
      val = date.extractDate(val, 'YYYY-MM-DD')
      val = date.adjustDate(props.modelValue, { year: val.getFullYear(), month: val.getMonth() + 1, date: val.getDate() })
    }
    emit('update:model-value', val || null)
  },
})

function focus (event) {
  // If it's a button, it's the "clear" button
  // so we don't want to pop open the calendar
  if (event.target.nodeName !== 'BUTTON') {
    proxy.value.show()
  }
}
</script>
