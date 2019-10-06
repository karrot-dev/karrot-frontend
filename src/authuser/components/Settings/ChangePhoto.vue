<template>
  <div class="edit-box k-change-photo">
    <QField
      :label="label"
      stack-label
      :error="hasError('photo')"
      :error-message="firstError('photo')"
      :hint="hint"
      :loading="loading"
    >
      <template v-slot:before>
        <QIcon name="fas fa-camera" />
      </template>
      <template v-slot:control>
        <Croppa
          ref="croppaPhoto"
          class="q-mt-sm"
          :height="size"
          :width="size"
          :quality="quality"
          placeholder=""
          prevent-white-space
          replace-drop
          :class="{'cursor-pointer': canChoose}"
          :zoom-speed="10"
          :initial-image="photo"
          :show-remove-button="false"
          @init="init"
          @move="allowSave"
          @zoom="allowSave"
          @new-image-drawn="newImageDrawn"
          @loading-start="loading = true"
          @loading-end="loading = false"
          @image-remove="canChoose = true"
        >
          <img
            slot="placeholder"
            src="statics/add_a_photo.svg"
          >
        </Croppa>
        <QResizeObserver @resize="onResize" />
      </template>
    </QField>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>

    <div class="row justify-end q-gutter-sm q-mt-sm">
      <QBtn
        type="button"
        :disable="!canSave"
        @click="reset"
      >
        {{ $t('BUTTON.RESET') }}
      </QBtn>
      <QBtn
        :disable="!hasPhoto"
        type="button"
        color="red"
        @click="destroy"
      >
        {{ $t('BUTTON.DELETE') }}
      </QBtn>
      <QBtn
        v-t="'BUTTON.SAVE_CHANGES'"
        color="primary"
        :loading="isPending"
        :disable="!canSave"
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
  QResizeObserver,
} from 'quasar'
import CroppaPlugin from 'vue-croppa'
const Croppa = CroppaPlugin.component
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QField,
    QBtn,
    QIcon,
    QResizeObserver,
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
      canSave: false,
      canChoose: true,
      refreshing: false,
      loading: false,
      size: 300,
      quality: 2,
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
    photo (val) {
      if (val) {
        this.refreshing = true
        this.$refs.croppaPhoto.refresh()
      }
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
      this.canSave = false
    },
    destroy () {
      this.$refs.croppaPhoto.remove()
      this.allowSave()
    },
    reset () {
      this.$refs.croppaPhoto.refresh()
      this.canSave = false
    },
    allowSave () {
      this.canSave = true
    },
    newImageDrawn () {
      this.canChoose = false
      if (this.refreshing) {
        this.refreshing = false
      }
      else {
        this.allowSave()
      }
    },
    init () {
      if (this.photo) this.refreshing = true
    },
    onResize ({ width: availableWidth }) {
      const resolutionWidth = 600
      const desiredWith = Math.max(Math.min(availableWidth, 300), 50)
      this.quality = resolutionWidth / desiredWith
      this.$nextTick(() => {
        this.size = desiredWith
      })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'

</style>
