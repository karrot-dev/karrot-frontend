<template>
  <QDialog
    ref="dialogRef"
    maximized
    @hide="onDialogHide"
    @keyup.left="previousImage"
    @keyup.right="nextImage"
  >
    <QCard
      flat
      class="q-dialog-plugin bg-transparent no-margin"
      @click="maybeClose"
    >
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
        class="bg-transparent"
        :class="Platform.is.desktop ? 'q-pa-xl' : ''"
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
              @click.stop.prevent="onDialogOK"
            />
          </QCarouselControl>
        </template>
      </QCarousel>
    </QCard>
  </QDialog>
</template>

<script setup>
import {
  QDialog,
  QCarousel,
  QCarouselSlide,
  QCarouselControl,
  QBtn,
  Platform,
  QCard,
  useDialogPluginComponent,
} from 'quasar'
import { computed, ref } from 'vue'

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

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const images = computed(() => {
  return props.attachments.filter(attachment => isViewableImageContentType(attachment.contentType))
})

const currentId = ref(props.selectedAttachmentId ?? images.value?.[0].id)

const currentAttachment = computed(() => props.attachments.find(attachment => attachment.id === currentId.value))

const moreThanOneImage = computed(() => images.value.length > 1)

const carouselRef = ref(null)

function maybeClose (event) {
  if ([
    'q-carousel__slide', // The slide itself
    'q-panel', // The overlay
  ].some(className => event.target.classList.contains(className))) {
    onDialogOK()
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
.q-carousel
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
