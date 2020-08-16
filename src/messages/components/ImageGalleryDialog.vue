<template>
  <QDialog
    ref="dialog"
    square
    @hide="onDialogHide"
    @keyup.left="previousImage"
    @keyup.right="nextImage"
  >
    <QCard class="q-dialog-plugin">
      <QCardActions
        align="right"
      >
        <QBtn
          v-close-popup
          icon-right="close"
          flat
          label="Close"
        />
      </QCardActions>
      <QCarousel
        ref="carousel"
        v-model="current"
        transition-prev="slide-right"
        transition-next="slide-left"
        :arrows="moreThanOneImage"
        :swipeable="moreThanOneImage"
        :thumbnails="moreThanOneImage"
        animated
        control-color="white"
        infinite
        padding
        class="bg-white shadow-1 rounded-borders"
      >
        <QCarouselSlide
          v-for="image in message.images"
          :key="image.id"
          :name="image.id"
          :img-src="image.imageUrls['600']"
        />
      </QCarousel>
    </QCard>
  </QDialog>
</template>

<script>
import {
  QBtn,
  QCard,
  QCardActions,
  QDialog,
  QCarousel,
  QCarouselSlide,
} from 'quasar'

export default {
  name: 'ImageGalleryDialog',
  components: {
    QBtn,
    QCard,
    QCardActions,
    QDialog,
    QCarousel,
    QCarouselSlide,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    selectedImageId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data () {
    return {
      current: this.selectedImageId !== null ? this.selectedImageId : this.message.images[0].id,
    }
  },
  computed: {
    moreThanOneImage () {
      return this.message.images.length > 1
    },
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onOKClick () {
      this.$emit('ok')
      this.hide()
    },
    onCancelClick () {
      this.hide()
    },
    nextImage () {
      this.$refs.carousel.next()
    },
    previousImage () {
      this.$refs.carousel.previous()
    },
  },
}
</script>

<style lang="stylus">
// make it full width when on mobile
.mobile
  .q-dialog .q-card
    margin 0

  .q-dialog__inner--minimized
    padding 0
</style>
