<template>
  <Croppa
    :ref="croppa"
    :height="300"
    :width="800"
    placeholder=""
    :quality="4"
    prevent-white-space
    :initial-image="initialImage"
    initial-size="cover"
    class="q-mt-sm grey-border"
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
</template>

<script setup>
import { ref, computed } from 'vue'
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

const croppa = ref('croppa')

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  urls: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const initialImage = computed(() => {
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

function imageDrawn () {
  if (croppa.value && croppa.value.hasImage()) {
    // TODO: check if it's actually changed before doing this, not just initial image...
    emit('update:modelValue', {
      toBlob (mimeType) {
        return croppa.value && croppa.value.hasImage() && croppa.value.promisedBlob(mimeType, 0.9)
      },
    })
  }
}
</script>

<style scoped lang="sass">
.croppa-container.croppa--has-target
  cursor: move
</style>
