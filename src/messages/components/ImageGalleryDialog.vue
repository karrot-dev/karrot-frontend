<template>
  <QDialog
    ref="dialog"
    @hide="onDialogHide"
  >
    <QCard class="q-dialog-plugin">
      <QCarousel
        v-model="current"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="white"
        navigation
        padding
        arrows
        class="bg-white shadow-1 rounded-borders"
      >
        <QCarouselSlide
          v-for="image in message.images"
          :key="image.id"
          :name="image.id"
          :img-src="image.imageUrls.fullSize"
        />
      </QCarousel>
    </QCard>
  </QDialog>
</template>

<script>
import {
  QCard,
  QDialog,
  QCarousel,
  QCarouselSlide,
} from 'quasar'

export default {
  name: 'ImageGalleryDialog',
  components: {
    QCard,
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
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show () {
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide()
    },
  },
}
</script>
