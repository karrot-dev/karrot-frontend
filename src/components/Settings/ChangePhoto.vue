<template>
  <div class="edit-box">
    <q-field
      icon="fa-camera"
      :label="$t('USERDATA.PHOTO')"
      :error="hasError('photo')"
      :error-label="firstError('photo')"
      :helper="$t('USERDATA.SET_PHOTO')"
    >
      <croppa
        ref="croppaPhoto"
        :width="300"
        :height="300"
        placeholder=""
        canvas-color="#fff"
        :prevent-white-space="true"
        :show-loading="true"
        @file-choose="saveDisabled = false"
      >
        <img
          v-if="hasPhoto"
          slot="initial"
          :src="photo"
        >
        <img
          slot="placeholder"
          src="statics/ic_person_black_24px.svg"
        >
      </croppa>
    </q-field>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>

    <div class="actionButtons">
      <q-btn
        color="primary"
        @click="save"
        loader
        :value="isPending"
        :disabled = "saveDisabled"
        v-t="'BUTTON.SAVE_CHANGES'"
      />
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import CroppaPlugin from 'vue-croppa'
const Croppa = CroppaPlugin.component
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn, Croppa },
  mixins: [statusMixin],
  props: {
    value: { required: true, type: Object },
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
      const url = this.value.photoUrls && this.value.photoUrls.fullSize
      if (!url) return

      // In development we want to force the images to load from our local proxy
      // so that we don't issues with missing CORS headers
      if (DEV) return ['http://localhost:8080', url.substring(url.indexOf('/media'))].join('')

      return url
    },
  },
  methods: {
    async save () {
      if (this.$refs.croppaPhoto.hasImage()) {
        const photoBlob = await this.$refs.croppaPhoto.promisedBlob('image/jpeg', 0.9)
        const data = new FormData()
        data.append('photo', photoBlob, 'photo.jpeg')
        this.$emit('save', data)
      }
      else {
        this.$emit('save', { photo: null })
      }
      this.saveDisabled = true
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>

<style lang="stylus">
.croppa-container canvas
  width 100% !important
  height 100% !important
  max-width 300px
  max-height 300px
</style>
