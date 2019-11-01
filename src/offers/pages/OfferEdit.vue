<template>
  <div>
    <QCard>
      <h1>yay offer edit</h1>
      <div
        class="edit-box"
        :class="{ changed: hasChanged }"
      >
        <form @submit.prevent="maybeSave">
          <QInput
            id="offer-name"
            v-model="edit.name"
            :label="$t('GROUP.TITLE')"
            :error="hasNameError"
            :error-message="nameError"
            :autofocus="!$q.platform.has.touch"
            autocomplete="off"
            @blur="$v.edit.name.$touch"
          >
            <template v-slot:before>
              <QIcon name="fas fa-fw fa-star" />
            </template>
          </QInput>

          <MarkdownInput
            v-model="edit.description"
            icon="fas fa-fw fa-address-card"
            :label="$t('GROUP.DESCRIPTION_VERBOSE')"
            :error="hasError('description')"
            :error-message="firstError('description')"
            @keyup.ctrl.enter="maybeSave"
          />

          <QField stack-label />

          <div>
            <div
              v-for="(photo, idx) in photos"
              :key="photo.id"
              class="q-ma-sm inline-block"
            >
              <Croppa
                ref="croppaRefs"
                placeholder="+"
                :class="croppaClasses(idx)"
                prevent-white-space
                :show-remove-button="false"
                @new-image-drawn="newImage(photo.id)"
              />
              <QBtn
                v-if="hasImage(idx)"
                round
                class="q-ma-xs"
                size="sm"
                icon="keyboard_arrow_left"
                :disable="isFirstImage(idx)"
                @click="moveImage(idx, -1)"
              />
              <QBtn
                v-if="hasImage(idx)"
                round
                class="q-ma-xs"
                size="sm"
                icon="delete"
                color="red"
                :disable="!hasImage(idx)"
                @click="removeImage(idx)"
              />
              <QBtn
                v-if="hasImage(idx)"
                round
                class="q-ma-xs"
                size="sm"
                icon="keyboard_arrow_right"
                :disable="isLastImage(idx)"
                @click="moveImage(idx, 1)"
              />
            </div>
            <QBtn @click="savePiccies">
              SAVE PICCIES
            </QBtn>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-sm">
            <QBtn
              v-if="!isNew"
              type="button"
              :disable="!hasChanged"
              @click="reset"
            >
              {{ $t('BUTTON.RESET') }}
            </QBtn>

            <QBtn
              type="submit"
              color="primary"
              :disable="!canSave"
              :loading="isPending"
            >
              {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
            </QBtn>
          </div>
        </form>
      </div>
    </QCard>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import { QBtn, QCard, QField, QIcon, QInput } from 'quasar'
import MarkdownInput from '@/utils/components/MarkdownInput'
import CroppaPlugin from 'vue-croppa'
const Croppa = CroppaPlugin.component

let nextId = 0
function getNextId () {
  return ++nextId
}

export default {
  components: {
    Croppa,
    MarkdownInput,
    QBtn,
    QCard,
    QField,
    QInput,
    QIcon,
  },
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({
        name: undefined,
        description: undefined,
      }),
    },
  },
  data () {
    return {
      photos: [{
        id: getNextId(),
      }],
    }
  },
  computed: {
    hasChanged () {
      return false
    },
    canSave () {
      if (this.$v.edit.$error) {
        return false
      }
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    hasNameError () {
      return !!this.nameError
    },
    nameError () {
      if (this.$v.edit.name.$error) {
        const m = this.$v.edit.name
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', { min: 4 })
        if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
        if (!m.isUnique) return this.$t('VALIDATION.UNIQUE')
      }
      return this.firstError('name')
    },
  },
  methods: {
    getPhotoCount () {
      if (typeof this.$refs.croppaRefs === 'undefined') return 0
      return this.$refs.croppaRefs.filter(croppa => croppa.hasImage())
    },
    newImage (id) {
      console.log('new image at idx', id)
      this.photos.push({ id: getNextId() })
    },
    removeImage (idx) {
      console.log('removed at', idx)
      // const idx = this.photos.findIndex(photo => photo.id === id)
      // if (idx !== -1) this.photos.splice(idx, 1)
      this.photos.splice(idx, 1)
      this.$refs.croppaRefs.splice(idx, 1)
      if (this.photos.length === 0) this.photos.push({ id: getNextId() })
    },
    maybeSave (event) {
      this.$v.edit.$touch()
      if (!this.canSave) return
      this.$v.edit.$reset()
      this.save()
    },
    async savePiccies () {
      const blobs = []
      for (const croppa of this.$refs.croppaRefs) {
        if (croppa.hasImage()) {
          blobs.push({
            blob: await croppa.promisedBlob('image/png', 0.9),
          })
        }
      }
      console.log('blobs!', blobs)
    },
    moveImage (idx, by) {
      const newIdx = idx + by
      this.photos.splice(newIdx, 0, this.photos.splice(idx, 1)[0])
      this.$refs.croppaRefs.splice(newIdx, 0, this.$refs.croppaRefs.splice(idx, 1)[0])
    },
    hasImage (idx) {
      if (!this.$refs.croppaRefs) return
      const croppa = this.$refs.croppaRefs[idx]
      return croppa && croppa.hasImage && croppa.hasImage()
    },
    isFirstImage (idx) {
      return idx === 0
    },
    isLastImage (idx) {
      return idx >= this.photos.length - 2
    },
    croppaClasses (idx) {
      if (this.hasImage(idx)) return []
      return ['new-image']
    },
  },
  validations: {
    edit: {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(80),
      },
      description: {
        required,
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
.new-image
  border 1px solid #ddd
</style>
