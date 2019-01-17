<template>
  <div class="edit-box k-change-photo">
    <QField
      icon="fas fa-camera"
      :label="label"
      :error="hasError('photo')"
      :error-label="firstError('photo')"
      :helper="helper"
    >
      <Croppa
        ref="croppaPhoto"
        :width="300"
        :height="300"
        placeholder=""
        :prevent-white-space="true"
        :show-loading="true"
        @file-choose="saveDisabled = false"
        @image-remove="saveDisabled = false"
        :class="{pointer: !hasPhoto}"
        :zoom-speed="10"
      >
        <img
          v-if="hasPhoto"
          slot="initial"
          :src="photo"
        >
        <img
          slot="placeholder"
          src="statics/add_a_photo.svg"
        >
      </Croppa>
    </QField>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>

    <div class="actionButtons">
      <QBtn
        color="primary"
        @click="save"
        :loading="isPending"
        :disabled="saveDisabled"
        v-t="'BUTTON.SAVE_CHANGES'"
      />
    </div>
  </div>
</template>

<script>
import {
  QField,
  QBtn,
} from 'quasar'
import CroppaPlugin from 'vue-croppa'
const Croppa = CroppaPlugin.component
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QField,
    QBtn,
    Croppa,
  },
  mixins: [statusMixin],
  props: {
    value: { required: true, type: Object },
    mimeType: { type: String, default: 'image/png' },
    label: { type: String, default: '' },
    helper: { type: String, default: '' },
  },
  data () {
    return {
      saveDisabled: true,
    }
  },
  watch: {
    photo () {
      this.$refs.croppaPhoto.refresh()
    },
  },
  computed: {
    hasPhoto () {
      return !!this.photo
    },
    photo () {
      const url = this.value && this.value.photoUrls && this.value.photoUrls.fullSize
      if (!url) return

      // In development we want to force the images to load from our local proxy
      // so that we don't get issues with missing CORS headers
      if (__ENV.DEV) return ['http://localhost:8080', url.substring(url.indexOf('/media'))].join('')

      return url
    },
  },
  methods: {
    async save () {
      if (this.$refs.croppaPhoto.hasImage()) {
        const photoBlob = await this.$refs.croppaPhoto.promisedBlob(this.mimeType, 0.9)
        this.$emit('save', photoBlob)
      }
      else {
        this.$emit('save', null)
      }
      this.saveDisabled = true
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
.k-change-photo
  >>> .croppa-container
    canvas
      width 100% !important
      height 100% !important
      max-width 300px
      max-height 300px
      cursor pointer
</style>
