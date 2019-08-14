<template>
  <div class="edit-box k-change-photo">
    <QField
      :label="label"
      stack-label
      :error="hasError('photo')"
      :error-message="firstError('photo')"
      :hint="hint"
    >
      <template v-slot:prepend>
        <QIcon name="fas fa-camera" />
      </template>
      <template v-slot:control>
        <Croppa
          ref="croppaPhoto"
          :width="300"
          :height="300"
          placeholder=""
          prevent-white-space
          show-loading
          :class="{pointer: !hasPhoto}"
          :zoom-speed="10"
          @file-choose="saveDisabled = false"
          @image-remove="saveDisabled = false"
        >
          <template v-slot:initial>
            <img
              v-if="hasPhoto"
              :src="photo"
            >
          </template>
          <template v-slot:placeholder>
            <img :src="placeholder">
          </template>
        </Croppa>
      </template>
    </QField>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>

    <div class="actionButtons">
      <QBtn
        v-t="'BUTTON.SAVE_CHANGES'"
        color="primary"
        :loading="isPending"
        :disabled="saveDisabled"
        @click="save"
      />
    </div>
  </div>
</template>

<script>
import {
  QField,
  QBtn,
  QIcon,
} from 'quasar'
import CroppaPlugin from 'vue-croppa'
const Croppa = CroppaPlugin.component
import statusMixin from '@/utils/mixins/statusMixin'
import placeholder from '@/statics/add_a_photo.svg'

export default {
  components: {
    QField,
    QBtn,
    QIcon,
    Croppa,
  },
  mixins: [statusMixin],
  props: {
    value: {
      type: Object,
      default: null,
    },
    mimeType: {
      type: String,
      default: 'image/png',
    },
    label: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      saveDisabled: true,
      placeholder,
    }
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
      if (__ENV.DEV && url.includes('/media')) return ['http://localhost:8080', url.substring(url.indexOf('/media'))].join('')

      return url
    },
  },
  watch: {
    photo () {
      this.$refs.croppaPhoto.refresh()
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
