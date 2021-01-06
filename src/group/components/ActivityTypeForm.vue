<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form
      class="q-gutter-y-lg"
      style="max-width: 700px"
      @submit.prevent="maybeSave"
    >
      <h3 v-if="isNew">
        {{ $t('ACTIVITY_TYPES.ADD') }}
      </h3>
      <QField
        v-if="!isNew"
        borderless
        :hint="$t(`ACTIVITY_TYPES.STATUS_${edit.status.toUpperCase()}_HINT`)"
      >
        <template #control>
          <QToggle
            v-model="edit.status"
            :label="$t(`ACTIVITY_TYPE_STATUS.${edit.status.toUpperCase()}`)"
            true-value="active"
            false-value="archived"
            color="green"
          />
        </template>
      </QField>

      <QField borderless>
        <template #before>
          <QIcon
            :name="edit.icon"
            size="lg"
            :color="`activity-type-${edit.id}-edit`"
          />
        </template>
        <template #control>
          <QBtn
            :label="$t('BUTTON.CHANGE_ICON')"
            flat
            color="primary"
            class="q-mr-sm"
          >
            <QMenu
              ref="iconMenu"
              square
            >
              <QInput
                v-model="iconFilter"
                label="Filter"
                outlined
                clearable
                class="q-ma-md"
                :autofocus="!$q.platform.has.touch"
              />
              <QIconPicker
                v-model="edit.icon"
                icon-set="fontawesome-v5"
                :filter="iconFilter"
                :color="colour"
                selected-color="white"
                :selected-background-color="colour"
                :pagination.sync="iconPagination"
                style="height: 220px;"
              />
            </QMenu>
          </QBtn>

          <QBtn
            :label="$t('BUTTON.CHANGE_COLOUR')"
            flat
            color="primary"
          >
            <QMenu
              auto-close
              square
            >
              <QColor
                v-model="colour"
                style="width: 350px; max-width: 100%;"
                format-model="hex"
                no-footer
                no-header
                default-view="palette"
                :palette="paletteColours"
                square
                flat
              />
            </QMenu>
          </QBtn>
        </template>
      </QField>

      <QSelect
        ref="nameInput"
        v-model="edit.name"
        filled
        emit-value
        map-options
        use-input
        fill-input
        hide-selected
        :label="$t('ACTIVITY_TYPES.NAME')"
        :options="translatableNameOptions"
        :error="hasNameError"
        :error-message="nameError"
        autocomplete="off"
        type="input"
        :hint="edit.nameIsTranslatable ? $t('ACTIVITY_TYPES.STANDARD_NAME_HINT') : $t('ACTIVITY_TYPES.CUSTOM_NAME_HINT')"
        @blur="$v.edit.name.$touch"
        @input-value="onNameInput"
        @keyup.enter="() => $refs.nameInput.hidePopup()"
      >
        <template #option="{ index, itemProps, itemEvents, opt: { label: itemLabel, useCustomName } }">
          <QItem
            :key="index"
            v-bind="itemProps"
            v-on="itemEvents"
          >
            <QItemSection>
              <QItemLabel v-if="useCustomName">
                <i18n
                  v-if="itemLabel && !edit.nameIsTranslatable"
                  path="ACTIVITY_TYPES.CUSTOM_NAME_USE"
                >
                  <template #name>
                    <strong>{{ itemLabel }}</strong>
                  </template>
                </i18n>
                <span v-else>
                  {{ $t('ACTIVITY_TYPES.CUSTOM_NAME_PROMPT') }}
                </span>
              </QItemLabel>
              <QItemLabel v-else>
                {{ itemLabel }}
              </QItemLabel>
            </QItemSection>
          </QItem>
          <template v-if="useCustomName">
            <QSeparator />
            <QItemLabel header>
              {{ $t('ACTIVITY_TYPES.STANDARD_NAME_HEADING') }}
            </QItemLabel>
          </template>
        </template>
      </QSelect>

      <QField
        borderless
        hide-bottom-space
        :hint="edit.hasFeedback ? $t('ACTIVITY_TYPES.FEEDBACK_YES_HINT') : $t('ACTIVITY_TYPES.FEEDBACK_NO_HINT')"
      >
        <QToggle
          v-model="edit.hasFeedback"
          :label="$t('ACTIVITY_TYPES.FEEDBACK')"
        />
        <QToggle
          v-if="edit.hasFeedback"
          v-model="edit.hasFeedbackWeight"
          :label="$t('ACTIVITY_TYPES.FEEDBACK_WEIGHT_LABEL')"
          class="q-ml-lg"
        />
      </QField>

      <template v-if="edit.hasFeedback">
        <QField borderless>
          <template #before>
            <QIcon
              :name="edit.feedbackIcon"
              size="lg"
              :color="`activity-type-${edit.id}-edit`"
            />
          </template>
          <template #control>
            <QBtn
              :label="$t('BUTTON.CHANGE_ICON')"
              flat
              color="primary"
            >
              <QMenu
                ref="feedbackIconMenu"
              >
                <QInput
                  v-model="feedbackIconFilter"
                  label="Filter"
                  outlined
                  clearable
                  class="q-ma-md"
                  :autofocus="!$q.platform.has.touch"
                />
                <QIconPicker
                  v-model="edit.feedbackIcon"
                  icon-set="fontawesome-v5"
                  :filter="feedbackIconFilter"
                  :color="colour"
                  selected-color="white"
                  :selected-background-color="colour"
                  :pagination.sync="feedbackIconPagination"
                  style="height: 220px;"
                />
              </QMenu>
            </QBtn>
          </template>
        </QField>
      </template>

      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          @click="$emit('cancel')"
        >
          {{ $t('BUTTON.CANCEL') }}
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
</template>

<script>
import {
  QSelect,
  QInput,
  QField,
  QBtn,
  QToggle,
  QMenu,
  QIcon,
  QColor,
  QItem,
  QItemSection,
  QItemLabel,
  QSeparator,
  colors,
} from 'quasar'
import { Component as QIconPicker } from '@quasar/quasar-ui-qiconpicker'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { createActivityTypeStylesheet } from '@/activities/datastore/activityTypeStylesheetPlugin'

import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

const { getPaletteColor } = colors

// We provide a limited palette of colours to choose from that we think will look nice
// See https://quasar.dev/style/color-palette#Color-List
const COLOUR_NAMES = [
  'pink',
  'purple',
  'indigo',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'amber',
  'deep-orange',
  'blue-grey',
]

const COLOUR_SHADES = [
  8,
  9,
  10,
]

// For the colour picker we need to provide a flat array with all the colours and shades
// Quasar warns that "getPaletteColor" is quite expensive function to call, putting it here means it's only called
// once for the whole module when it's first loaded (which would be async hopefully), not once per form
const PALETTE_COLOURS = COLOUR_SHADES.flatMap(number => COLOUR_NAMES.map(name => getPaletteColor(`${name}-${number}`)))

export default {
  components: {
    QSelect,
    QInput,
    QField,
    QBtn,
    QToggle,
    QMenu,
    QIcon,
    QColor,
    QIconPicker,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
  },
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    activityTypes: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      paletteColours: PALETTE_COLOURS,
      customName: '',
      iconFilter: '',
      iconPagination: {
        itemsPerPage: 20,
        page: 0,
      },
      feedbackIconFilter: '',
      feedbackIconPagination: {
        itemsPerPage: 20,
        page: 0,
      },
    }
  },
  computed: {
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    translatableNames () {
      return [
        // alphabetical
        'Activity',
        'Distribution',
        'Event',
        'Meeting',
        'Pickup',
        'Task',
      ]
    },
    translatableNameOptions () {
      return [
        {
          value: this.edit.name,
          label: this.edit.name && this.edit.nameIsTranslatable ? this.$t(`ACTIVITY_TYPE_NAMES.${this.edit.name}`) : this.edit.name,
          useCustomName: true,
          disable: this.edit.nameIsTranslatable,
        },
        ...this.translatableNames.map((value, idx) => ({
          value,
          label: this.$t(`ACTIVITY_TYPE_NAMES.${value}`),
          // prevent people from trying to choose a name that is already used (it's not allowed, and enforced by backend too)
          disable: this.activityTypeNamesInUse.includes(value),
        })),
      ]
    },
    activityTypeNamesInUse () {
      return this.activityTypes
        .filter(activityType => activityType.id && activityType.id !== this.edit.id)
        .map(activityType => activityType.name)
    },
    hasNameError () {
      return !!this.nameError
    },
    nameError () {
      if (this.$v.edit.name.$error) {
        const m = this.$v.edit.name
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.isUnique) return this.$t('VALIDATION.UNIQUE')
      }
      return this.firstError('name')
    },
    colour: {
      get () {
        return `#${this.edit.colour}`
      },
      set (val) {
        this.edit.colour = val.substring(1)
      },
    },
    activityTypesDebug () {
      return this.activityTypes.map(({ id, name, status, group }) => ({ id, name, status, group }))
    },
  },
  watch: {
    'edit.colour': {
      handler () {
        // TODO: this doesn't handle yet when it doesn't have an id (new...)
        // Keep our activity type class names up to date!
        this.updateActivityTypes([this.edit])
      },
      immediate: true,
    },
    'edit.icon' () {
      this.$refs.iconMenu.hide()
    },
    'edit.feedbackIcon' () {
      this.$refs.feedbackIconMenu.hide()
    },
  },
  beforeCreate () {
    const { updateActivityTypes, removeStylesheet } = createActivityTypeStylesheet('-edit')
    Object.assign(this, {
      updateActivityTypes,
      removeStylesheet,
    })
  },
  beforeDestroy () {
    this.removeStylesheet()
  },
  methods: {
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    onNameInput (value) {
      // See if the typed in value is one of our option values OR labels (i.e. the translated text)
      const option = this.translatableNameOptions.find(option => option.label === value || option.value === value)
      if (option) {
        // It is, therefore translatable!
        this.edit.name = option.value
        this.edit.nameIsTranslatable = true
      }
      else {
        // Nope, it's a custom name
        this.edit.name = value
        this.edit.nameIsTranslatable = false
      }
    },
  },
  validations: {
    edit: {
      name: {
        required,
        isUnique (value) {
          return !this.activityTypeNamesInUse.includes(value)
        },
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>

<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
