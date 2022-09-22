<template>
  <div class="full-width">
    <Croppa
      v-if="showCroppa"
      ref="croppa"
      placeholder=""
      :quality="4"
      auto-sizing
      prevent-white-space
      replace-drop
      initial-size="cover"
      class="q-mb-sm grey-border cursor-pointer full-width"
      style="aspect-ratio: 8 / 3"
      :show-remove-button="false"
      @new-image-drawn="imageDrawn"
    >
      <template #placeholder>
        <img
          src="statics/add_a_photo.svg"
          :width="200"
        >
      </template>
    </Croppa>
    <QImg
      v-else-if="showExisting"
      :src="existingImageURL"
      class="q-mb-sm grey-border full-width"
    />
    <QBtn
      v-else
      label="Select image"
      unelevated
      @click="addImage"
    />
    <QBtn
      v-if="canRemove"
      label="Clear image"
      unelevated
      @click="removeImage"
    />
  </div>
</template>

<script setup>
import { nextTick, ref, computed } from '@vue/compat'
import { QBtn, QImg } from 'quasar'
import CroppaPlugin from 'vue-croppa'

/*
TODO:
- click to change image
- don't show crosshair/move cursor if cannot move (existing image)
- show placeholder
- don't show value as changed, unless we've actually got a changed image...
 */

const Croppa = CroppaPlugin.component
// Upgrade Croppa once it's compatible with Vue3: https://github.com/zhanziyang/vue-croppa/issues/235
Croppa.compatConfig = { MODE: 2 }

const croppa = ref(null)

const editing = ref(false)

const props = defineProps({
  /*
   * undefined = we are not modifying the value
   * null = we want the image to be removed
   * { toBlob } = we have image data to be saved
   */
  modelValue: {
    type: Object,
    default: undefined,
  },
  urls: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'update:modelValue',
])

defineExpose({
  reset,
})

const showCroppa = computed(() => {
  return editing.value
})

const showExisting = computed(() => {
  return !editing.value && existingImageURL.value && props.modelValue !== null
})

const canRemove = computed(() => {
  if (props.modelValue === null) return false
  return existingImageURL.value || (croppa.value && croppa.value.hasImage())
})

async function addImage () {
  editing.value = true
  await nextTick() // need to give it a moment to render the croppa
  croppa.value.chooseFile()
}

const existingImageURL = computed(() => {
  const url = props.urls.fullSize
  if (!url) return

  // In development we want to force the images to load from our local proxy
  // so that we don't get issues with missing CORS headers
  if (process.env.DEV && url.startsWith('http')) {
    const { pathname } = new URL(url)
    if (pathname.startsWith('/media')) {
      return [location.protocol, '//', location.host, pathname].join('')
    }
  }

  return url
})

const debug = computed(() => {
  return require('util').inspect({
    modelValue: props.modelValue,
  })
})

function reset () {
  console.log('aha resetting!')
  editing.value = false
  emit('update:modelValue', undefined)
}

function removeImage () {
  if (croppa.value) {
    croppa.value.remove()
  }
  emit('update:modelValue', existingImageURL.value ? null : undefined)
  editing.value = false
}

function imageDrawn () {
  if (croppa.value && croppa.value.hasImage()) {
    emit('update:modelValue', {
      toBlob (mimeType) {
        return croppa.value && croppa.value.hasImage() && croppa.value.promisedBlob(mimeType, 0.9)
      },
    })
  }
}
</script>
