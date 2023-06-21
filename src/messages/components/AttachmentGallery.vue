<template>
  <div class="gallery">
    <QCarousel
      ref="carouselRef"
      v-model="currentId"
      transition-prev="slide-right"
      transition-next="slide-left"
      :arrows="moreThanOneImage"
      :swipeable="moreThanOneImage"
      :thumbnails="moreThanOneImage"
      animated
      control-color="white"
      infinite
      padding
      :class="Platform.is.mobile ? '' : 'q-pa-xl'"
      @click="event => closeIfOverlay(event)"
    >
      <QCarouselSlide
        v-for="image in images"
        :key="image.id"
        :name="image.id"
        :img-src="image.urls.preview || image.urls.original"
      />
      <template #control>
        <QCarouselControl
          position="top-right"
          :offset="[12, 12]"
        >
          <QBtn
            icon="fas fa-download"
            rounded
            color="white"
            text-color="primary"
            :href="currentAttachment?.urls?.download"
            :label="$t('BUTTON.DOWNLOAD')"
          />
          <QBtn
            rounded
            icon="fas fa-times"
            color="white"
            text-color="primary"
            class="q-ml-sm"
            :label="$t('BUTTON.CLOSE')"
            @click="emit('close')"
          />
        </QCarouselControl>
      </template>
    </QCarousel>
  </div>
</template>

<script setup>
import {
  QCarousel,
  QCarouselSlide,
  QCarouselControl,
  QBtn,
  Platform,
} from 'quasar'
import { computed, ref } from 'vue'
import { useEvent } from 'vue-composable'

import { isViewableImageContentType } from '@/utils/utils'

const props = defineProps({
  attachments: {
    type: Array,
    required: true,
  },
  selectedAttachmentId: {
    type: Number,
    required: false,
    default: null,
  },
})

const emit = defineEmits([
  'close',
])

const images = computed(() => {
  return props.attachments.filter(attachment => isViewableImageContentType(attachment.contentType))
})

const currentId = ref(props.selectedAttachmentId ?? images.value?.[0].id)

const currentAttachment = computed(() => props.attachments.find(attachment => attachment.id === currentId.value))

const moreThanOneImage = computed(() => images.value.length > 1)

const carouselRef = ref(null)

// Support keyboard navigation
useEvent(document, 'keyup', event => {
  if (event.code === 'ArrowRight') {
    nextImage()
  }
  else if (event.code === 'ArrowLeft') {
    previousImage()
  }
  else if (event.code === 'Escape') {
    emit('close')
  }
})

function closeIfOverlay (event) {
  // The background of the carousel has a role "tabpanel" we can check...
  if (event.target.attributes.role?.value === 'tabpanel') {
    emit('close')
  }
}

function nextImage () {
  carouselRef.value.next()
}
function previousImage () {
  carouselRef.value.previous()
}
</script>

<style scoped lang="sass">
.gallery
  // make it full screen
  // the carousel does have a fullscreen mode
  // but it sets the whole body to position: fixed
  // which causes it to scroll upwards
  position: fixed
  inset: 0
  z-index: 10000
  width: 100vw
  height: 100vh

.q-carousel
  // a nice dimmed semi-transparent background
  background-color: rgba(0, 0, 0, 0.5)
  // full screen
  height: 100vh

.q-carousel__slide
  // make it fit the whole image
  background-size: contain
  background-repeat: no-repeat
  background-position: center center
  max-width: 1000px
  margin: 0 auto
</style>
