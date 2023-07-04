<template>
  <div
    class="choose-image relative-position rounded-borders overflow-hidden"
    :class="imageUrl || slots.default ? 'has-image' : ''"
    :style="style"
  >
    <a
      v-if="enabled"
      class="action text-white text-bold absolute-full change-photo cursor-pointer column flex-center"
      @click="chooseImage"
    >
      <QBtn
        v-if="imageUrl"
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
        v-if="imageUrl"
        :src="imageUrl"
        class="image fit"
      >
    </slot>
  </div>
</template>

<script setup>
import { QBtn, QIcon } from 'quasar'
import { computed, useSlots } from 'vue'

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

const { chooseImage, onChooseImage } = useChooseImage({
  aspectRatio: props.aspectRatio,
  outputFormat: props.outputFormat,
  title: props.dialogTitle,
})

function removeImage () {
  props.onChange?.({ image: null })
}

onChooseImage(async ({ image }) => {
  await props.onChange?.({ image })
})

const style = computed(() => ({
  width: `${props.width}px`,
  height: `${props.width / props.aspectRatio}px`,
}))

</script>
<style scoped lang="sass">

.choose-image
  width: 180px
  height: 180px

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
