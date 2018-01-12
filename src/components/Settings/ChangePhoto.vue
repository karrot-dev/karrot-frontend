<template>
  <div class="edit-box">
    <q-field
      icon="fa-camera"
      :label="$t('USERDATA.PHOTO')"
      :error="hasError('photo')"
      :error-label="firstError('photo')"
    >
      <croppa
        ref="croppaPhoto"
        :width="300"
        :height="300"
        :placeholder="$t('USERDATA.SET_PHOTO')"
        :prevent-white-space="true"
      >
        <img
          v-if="hasPhoto"
          slot="initial"
          :src="photo"
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
      >
        {{ $t('BUTTON.SAVE_PHOTO') }}
      </q-btn>
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
    value: { required: true },
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
      return this.value.photo && this.value.photo.fullSize
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
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
