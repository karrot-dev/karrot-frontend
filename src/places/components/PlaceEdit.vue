<template>
  <div>
    <QCard
      class="no-shadow grey-border"
      style="max-width: 700px"
    >
      <div
        class="edit-box"
        :class="{ changed: hasChanged }"
      >
        <form @submit.prevent="maybeSave">
          <QInput
            v-model="edit.name"
            :autofocus="!$q.platform.has.touch"
            :error="hasNameError"
            :error-message="nameError"
            :label="$t('STOREEDIT.NAME')"
            autocomplete="off"
            outlined
            class="q-mb-lg"
            @blur="$v.edit.name.$touch"
          >
            <template #before>
              <QIcon name="fas fa-star" />
            </template>
          </QInput>

          <QSelect
            v-model="edit.status"
            :options="statusOptions"
            map-options
            emit-value
            :label="$t('STOREEDIT.STATUS')"
            :error="hasError('status')"
            :error-message="firstError('status')"
            outlined
            class="q-mb-lg"
          >
            <template #before>
              <QIcon name="fas fa-handshake" />
            </template>
            <template #option="scope">
              <QItem
                :key="scope.index"
                dense
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <QItemSection side>
                  <QIcon
                    :name="scope.opt.icon"
                    :color="scope.opt.color"
                    size="1.1em"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>{{ scope.opt.label }}</QItemLabel>
                </QItemSection>
              </QItem>
            </template>
            <template #selected-item="scope">
              <div class="row">
                <QIcon
                  :name="scope.opt.icon"
                  :color="scope.opt.color"
                  size="1.1em"
                  class="on-left q-ml-xs"
                />
                <div>
                  {{ scope.opt.label }}
                </div>
              </div>
            </template>
          </QSelect>

          <MarkdownInput
            v-model="edit.description"
            icon="fas fa-question"
            :label="$t('STOREEDIT.DESCRIPTION')"
            :error="hasError('description')"
            :error-message="firstError('description')"
            outlined
            class="q-mb-lg"
            @keyup.ctrl.enter="maybeSave"
          />

          <QSelect
            v-model="edit.defaultView"
            :options="[
              {label: $t('GROUP.ACTIVITIES'), value: 'activities'},
              {label: $t('GROUP.WALL'), value: 'wall'}
            ]"
            map-options
            emit-value
            :label="$t('STOREEDIT.DEFAULT_VIEW')"
            outlined
            :hint="$t('STOREEDIT.DEFAULT_VIEW_HINT')"
            class="q-mb-lg"
          >
            <template #before>
              <QIcon name="fas fa-eye" />
            </template>
          </QSelect>

          <AddressPicker
            v-model="edit"
            icon="fas fa-map-marker"
            :color="markerColor"
            :font-icon="$icon('place')"
            :label="$t('STOREEDIT.ADDRESS')"
            :error="hasAddressError"
            :error-message="addressError"
            :default-map-center="defaultMapCenter"
            outlined
            class="q-mb-lg"
          />

          <div>
            <QField
              borderless
              :hint="$t('STOREEDIT.WEEKS_IN_ADVANCE')"
              stack-label
              hide-bottom-space
              :error="hasError('weeksInAdvance')"
              :error-message="firstError('weeksInAdvance')"
            >
              <template #before>
                <QIcon name="fas fa-calendar-alt" />
              </template>
              <template #control>
                <QSlider
                  v-model="edit.weeksInAdvance"
                  :min="1"
                  :max="10"
                  label
                  label-always
                  markers
                  class="q-mt-lg q-mx-md"
                />
              </template>
            </QField>
            <div
              v-if="!isNew && value.weeksInAdvance > edit.weeksInAdvance"
              class="q-ml-lg col-12 q-field__bottom text-warning"
            >
              <QIcon
                name="warning"
                class="vertical-center"
              />
              {{ $t('STOREEDIT.WEEKS_IN_ADVANCE_WARNING') }}
            </div>
          </div>

          <div
            v-if="hasNonFieldError || hasError('group')"
            class="text-negative"
          >
            {{ firstNonFieldError || firstError('group') }}
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <QBtn
              v-if="isNew"
              type="button"
              @click="$emit('cancel')"
            >
              {{ $t('BUTTON.CANCEL') }}
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
              v-if="!isNew"
              type="button"
              color="red"
              @click="archive"
            >
              {{ $t('BUTTON.ARCHIVE') }}
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
import {
  QCard,
  QField,
  QSlider,
  QInput,
  QBtn,
  QSelect,
  QIcon,
  QItem,
  QItemSection,
  QItemLabel,
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
    QIcon,
    QItem,
    QItemSection,
    QItemLabel,
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
        defaultView: 'activities',
      }),
    },
    currentGroup: {
      required: false,
      type: Object,
      default: () => ({}),
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
      for (const field of ['address', 'latitude', 'longitude']) {
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
          color: s.color,
          icon: s.icon,
        }))
    },
    markerColor () {
      if (this.edit) return optionsFor(this.edit).color
      return null
    },
    defaultMapCenter () {
      const { latitude: lat, longitude: lng } = this.edit.group || this.currentGroup || {}
      if (lat && lng) return { lat, lng }
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
        .onOk(() => this.$emit('save', { id: this.value.id, status: 'archived' }, event))
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
