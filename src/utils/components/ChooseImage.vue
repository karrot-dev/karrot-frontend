<template>
  <div
    class="choose-image relative-position rounded-borders overflow-hidden"
    :class="url || slots.default ? 'has-image' : ''"
    :style="style"
  >
    <a
      v-if="enabled"
      class="action text-white text-bold absolute-full change-photo cursor-pointer column flex-center"
      @click="chooseImage"
    >
      <QBtn
        v-if="url"
        icon="fas fa-times"
        flat
        round
        size="sm"
        color="red"
        class="bg-white absolute-top-right q-ma-sm"
        :title="$t('BUTTON.DELETE')"
        @click.prevent.stop="removeImage"
      />
      <QIcon
        name="fas fa-camera"
        size="xl"
      />
      <span class="q-px-lg text-center">
        {{ title }}
      </span>
    </a>
    <slot>
      <img
        v-if="url"
        :src="url"
        class="image fit"
      >
    </slot>
  </div>
</template>

<script setup>
import { useObjectUrl } from '@vueuse/core'
import { QBtn, QIcon } from 'quasar'
import { computed, toRef, useSlots } from 'vue'

import { useChooseImage } from '@/utils/composables'

const slots = useSlots()

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: null,
  },
  dialogTitle: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  // An image!
  // undefined means: don't use the field
  // null means: we don't have an image
  modelValue: {
    type: Blob,
    default: undefined,
  },
  width: {
    type: Number,
    default: 180,
  },
  aspectRatio: {
    type: Number,
    default: 1,
  },
  outputFormat: {
    type: String,
    default: null,
  },
  onChange: {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const modelValueUrl = useObjectUrl(computed(() => props.modelValue))

// If modelValue is undefined it means use the props image url, otherwise use our derived model value url
const url = computed(() => props.modelValue !== undefined ? modelValueUrl.value : props.imageUrl)

const { chooseImage, onChooseImage } = useChooseImage({
  aspectRatio: props.aspectRatio,
  outputFormat: props.outputFormat,
  title: props.dialogTitle,
})

function removeImage () {
  emit('update:modelValue', null)
  props.onChange?.({ image: null })
}

onChooseImage(async ({ image }) => {
  emit('update:modelValue', image)
  await props.onChange?.({ image })
})

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  // height: `${props.width / props.aspectRatio}px`,
  aspectRatio: props.aspectRatio,
}))

</script>
<style scoped lang="sass">

.choose-image
  .action
    background: rgba(0, 0, 0, 0.5)
    gap: 12px
    z-index: 1

  // If we have an image, only show on hover
  &.has-image
    .action
      visibility: hidden

  &:hover
    .action
      visibility: visible
</style>
