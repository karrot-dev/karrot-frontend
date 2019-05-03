<template>
  <div>
    <QCard class="no-shadow grey-border">
      <div
        class="edit-box"
        :class="{ changed: hasChanged }"
      >
        <form @submit.prevent="maybeSave">
          <QField
            icon="fas fa-star"
            :label="$t('STOREEDIT.NAME')"
            :error="hasNameError"
            :error-label="nameError"
          >
            <QInput
              v-model="edit.name"
              :autofocus="true"
              autocomplete="off"
              @blur="$v.edit.name.$touch"
            />
          </QField>
          <QField
            icon="fas fa-handshake"
            :label="$t('STOREEDIT.STATUS')"
            :error="hasError('status')"
            :error-label="firstError('status')"
          >
            <QSelect
              v-model="edit.status"
              :options="statusOptions"
            />
          </QField>

          <QField
            icon="fas fa-question"
            :label="$t('STOREEDIT.DESCRIPTION')"
            :error="hasError('description')"
            :error-label="firstError('description')"
          >
            <MarkdownInput :value="edit.description">
              <QInput
                v-model="edit.description"
                type="textarea"
                rows="3"
                @keyup.ctrl.enter="maybeSave"
              />
            </MarkdownInput>
          </QField>

          <QField
            icon="fas fa-map-marker"
            :label="$t('STOREEDIT.ADDRESS')"
            :error="hasAddressError"
            :error-label="addressError"
          >
            <AddressPicker
              v-model="edit"
              :color="markerColor"
              font-icon="fas fa-shopping-cart"
            />
          </QField>

          <QField
            icon="fas fa-calendar-alt"
            :label="$t('STOREEDIT.WEEKS_IN_ADVANCE')"
            :error="hasError('weeksInAdvance')"
            :error-label="firstError('weeksInAdvance')"
            :warning="value.weeksInAdvance > edit.weeksInAdvance"
            :warning-label="$t('STOREEDIT.WEEKS_IN_ADVANCE_WARNING')"
          >
            <QSlider
              v-model="edit.weeksInAdvance"
              :min="1"
              :max="10"
              label
              label-always
            />
          </QField>

          <div
            v-if="hasNonFieldError || hasError('group')"
            class="text-negative"
          >
            {{ firstNonFieldError || firstError('group') }}
          </div>

          <div class="actionButtons">
            <QBtn
              type="submit"
              color="primary"
              :disable="!canSave"
              :loading="isPending"
            >
              {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
            </QBtn>
            <QBtn
              v-if="!isNew"
              type="button"
              color="red"
              @click="archive"
            >
              {{ $t('BUTTON.ARCHIVE') }}
            </QBtn>
            <QBtn
              v-if="!isNew"
              type="button"
              :disable="!hasChanged"
              @click="reset"
            >
              {{ $t('BUTTON.RESET') }}
            </QBtn>
            <QBtn
              v-if="isNew"
              type="button"
              @click="$emit('cancel')"
            >
              {{ $t('BUTTON.CANCEL') }}
            </QBtn>
          </div>
        </form>
      </div>
    </QCard>
  </div>
</template>

<script>
import {
  QCard,
  QField,
  QSlider,
  QInput,
  QBtn,
  QSelect,
  Dialog,
} from 'quasar'
import AddressPicker from '@/maps/components/AddressPicker'
import MarkdownInput from '@/utils/components/MarkdownInput'
import { validationMixin } from 'vuelidate'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { statusList, optionsFor } from '@/places/placeStatus'

export default {
  name: 'PlaceEdit',
  components: {
    QCard,
    QField,
    QSlider,
    QInput,
    QBtn,
    QSelect,
    MarkdownInput,
    AddressPicker,
  },
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    value: {
      required: false,
      type: Object,
      default: () => ({
        name: undefined,
        description: undefined,
        weeksInAdvance: 4,
        latitude: undefined,
        longitude: undefined,
        address: undefined,
        status: 'created',
      }),
    },
    allPlaces: { required: true, type: Array },
  },
  computed: {
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
        if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', { min: 2 })
        if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
        if (!m.isUnique) return this.$t('VALIDATION.UNIQUE')
      }
      return this.firstError('name')
    },
    hasAddressError () {
      return !!this.addressError
    },
    addressError () {
      for (let field of ['address', 'latitude', 'longitude']) {
        if (this.hasError(field)) return this.firstError(field)
      }
      return null
    },
    statusOptions () {
      return statusList
        .filter(s => s.selectable)
        .map(s => ({
          value: s.key,
          label: this.$t(s.label),
          leftColor: s.color,
          icon: s.icon,
        }))
    },
    markerColor () {
      if (this.edit) return optionsFor(this.edit).color
      return null
    },
  },
  watch: {
    '$route.query' (val) {
      if (val) this.setLocation(val)
    },
  },
  mounted () {
    if (this.$route && this.$route.query) this.setLocation(this.$route.query)
  },
  methods: {
    setLocation ({ lat, lng }) {
      if (this.isNew) {
        if (!isNaN(lat) && !isNaN(lng)) {
          this.edit.latitude = lat
          this.edit.longitude = lng
        }
        else {
          this.edit.latitude = undefined
          this.edit.longitude = undefined
        }
      }
    },
    maybeSave () {
      this.$v.edit.$touch()
      if (!this.canSave) return
      this.$v.edit.$reset()
      this.save()
    },
    archive (event) {
      Dialog.create({
        title: this.$t('STOREEDIT.DIALOGS.ARCHIVE.TITLE'),
        message: this.$t('STOREEDIT.DIALOGS.ARCHIVE.MESSAGE'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('STOREEDIT.DIALOGS.ARCHIVE.CONFIRM'),
      })
        .then(() => this.$emit('save', { id: this.value.id, status: 'archived' }, event))
        .catch(() => {})
    },
  },
  validations: {
    edit: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(80),
        isUnique (value) {
          if (value === '') return true
          return !this.allPlaces
            .filter(e => e.id !== this.edit.id)
            .find(e => e.name === value)
        },
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
