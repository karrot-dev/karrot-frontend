<template>
  <QSelect
    ref="nameInput"
    :model-value="modelValue.name"
    filled
    emit-value
    map-options
    use-input
    fill-input
    hide-selected
    :options="translatableNameOptions"
    :hint="modelValue.nameIsTranslatable ? $t('ACTIVITY_TYPES.STANDARD_NAME_HINT') : $t('ACTIVITY_TYPES.CUSTOM_NAME_HINT')"
    autocomplete="off"
    type="input"
    @input-value="onNameInput"
    @keyup.enter="() => nameInput.hidePopup()"
  >
    <template #option="{ index, itemProps, opt: { label: itemLabel, useCustomName } }">
      <QItem
        :key="index"
        v-bind="itemProps"
      >
        <QItemSection>
          <QItemLabel v-if="useCustomName">
            <i18n-t
              v-if="itemLabel && !modelValue.nameIsTranslatable"
              scope="global"
              keypath="ACTIVITY_TYPES.CUSTOM_NAME_USE"
            >
              <template #name>
                <strong>{{ itemLabel }}</strong>
              </template>
            </i18n-t>
            <span v-else>
              {{ t('ACTIVITY_TYPES.CUSTOM_NAME_PROMPT') }}
            </span>
          </QItemLabel>
          <QItemLabel v-else>
            {{ itemLabel }}
          </QItemLabel>
        </QItemSection>
      </QItem>
      <template v-if="useCustomName">
        <QSeparator />
        <QItemLabel header>
          {{ t('ACTIVITY_TYPES.STANDARD_NAME_HEADING') }}
        </QItemLabel>
      </template>
    </template>
  </QSelect>
</template>
<script setup>
import { QItem, QItemLabel, QItemSection, QSelect, QSeparator } from 'quasar'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const nameInput = ref(null)

const { t } = useI18n()

const props = defineProps({
  // An entry with a "name" and "nameIsTranslatable" fields
  modelValue: {
    type: Object,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

function getCustomNameLabel () {
  if (!props.modelValue.name) return
  if (props.modelValue.nameIsTranslatable) {
    // Find the name in our options, so we can use its label, which will be translated
    return props.options.find(({ name }) => name === props.modelValue.name)?.label ?? props.modelValue.name
  }
  else {
    return props.modelValue.name
  }
}

const translatableNameOptions = computed(() => {
  return [
    {
      value: props.modelValue.name,
      label: getCustomNameLabel(),
      useCustomName: true,
      disable: props.modelValue.nameIsTranslatable,
    },
    ...props.options.map(({ name, label, disable }, idx) => ({
      value: name,
      label,
      disable,
    })),
  ]
})

function onNameInput (value) {
  // See if the user typed in a standard name
  const option = translatableNameOptions.value.find(option =>
  // (ignore the "special" option)
    !option.useCustomName && (
    // check if it matches the translated value
      option.label === value ||
        // or the non-translated value
        option.value === value
    ),
  )
  if (option) {
    // It is, therefore translatable!
    emit('update:modelValue', {
      ...props.modelValue,
      name: option.value,
      nameIsTranslatable: true,
    })
  }
  else {
    // Nope, it's a custom name
    emit('update:modelValue', {
      ...props.modelValue,
      name: value,
      nameIsTranslatable: false,
    })
  }
}
</script>
