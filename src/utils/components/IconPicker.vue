<template>
  <QBtn
    :label="t('BUTTON.CHANGE_ICON')"
    flat
    color="primary"
    class="q-mr-sm"
  >
    <QMenu
      ref="iconMenu"
      square
    >
      <QSelect
        v-model="iconTag"
        label="Tag"
        outlined
        clearable
        dense
        class="q-ma-md"
        :options="pickerTags"
      />
      <QInput
        v-model="iconFilter"
        :label="t('BUTTON.SEARCH')"
        outlined
        dense
        clearable
        class="q-ma-md"
        :autofocus="!$q.platform.has.touch"
      />
      <QIconPicker
        v-model:model-pagination="iconPagination"
        :model-value="modelValue"
        :icons="pickerIcons"
        :filter="iconFilter"
        color="white"
        :text-color="color"
        :selected-color="color"
        selected-text-color="white"
        style="height: 220px;"
        @update:model-value="value => emit('update:modelValue', value)"
      />
    </QMenu>
  </QBtn>
</template>

<script setup>
import { QIconPicker } from '@quasar/quasar-ui-qiconpicker'
import { QBtn, QInput, QMenu, QSelect } from 'quasar'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import allPickerIcons, { tags as pickerTags } from '@/utils/pickerIcons'

const { t } = useI18n()

const defaultIcon = 'fas fa-circle'

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: 'gray',
  },
})

const emit = defineEmits([
  'update:modelValue',
])

if (!props.modelValue) {
  emit('update:modelValue', defaultIcon)
}

const iconFilter = ref('')
const iconTag = ref(null)
const iconPagination = reactive({
  itemsPerPage: 20,
  page: 0,
})
const pickerIcons = computed(() => {
  if (!iconTag.value) return allPickerIcons
  return allPickerIcons.filter(icon => icon.tags.includes(iconTag.value))
})
</script>

<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
