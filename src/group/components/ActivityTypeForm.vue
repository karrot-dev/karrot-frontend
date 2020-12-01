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
      <QField borderless>
        <template #control>
          <QToggle
            v-model="edit.status"
            :label="edit.status"
            true-value="active"
            false-value="archived"
            color="green"
          />
        </template>
      </QField>
      <QSelect
        v-if="edit.nameIsTranslatable"
        v-model="edit.name"
        filled
        emit-value
        map-options
        :options="translatableNameOptions"
        :error="hasNameError"
        :error-message="nameError"
        :autofocus="!$q.platform.has.touch"
        autocomplete="off"
        :hint="edit.nameIsTranslatable ? 'name will be available in other languages' : 'name will be used exactly as you write it'"
        @blur="$v.edit.name.$touch"
      >
        <template #before>
          <QBtnToggle
            v-model="edit.nameIsTranslatable"
            :options="[
              { label: 'Standard name', value: true },
              { label: 'Custom name', value: false },
            ]"
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="primary"
          />
        </template>
      </QSelect>
      <QInput
        v-else
        id="name"
        v-model="edit.name"
        filled
        :label="$t('name')"
        :error="hasNameError"
        :error-message="nameError"
        :autofocus="!$q.platform.has.touch"
        autocomplete="off"
        :hint="edit.nameIsTranslatable ? 'name will be available in other languages' : 'name will be used exactly as you write it'"
        @blur="$v.edit.name.$touch"
      >
        <template #before>
          <QBtnToggle
            v-model="edit.nameIsTranslatable"
            :options="[
              { label: 'Standard name', value: true },
              { label: 'Custom name', value: false },
            ]"
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="primary"
          />
        </template>
      </QInput>

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
            label="Change icon"
            unelevated
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
                autofocus
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
            label="Change colour"
            unelevated
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

      <!--
      <QField
        borderless
        hide-bottom-space
      >
        <QToolbar>
          <QToolbarTitle>Feedback</QToolbarTitle>
        </QToolbar>
        <QToggle
          v-model="edit.hasFeedback"
          :label="edit.hasFeedback ? 'enabled' : 'disabled'"
        />
      </QField>
      -->

      <QField
        borderless
        hide-bottom-space
        :hint="edit.hasFeedback ? 'After the activity the participants will be asked to provide feedback' : 'No feedback will be requested'"
      >
        <QToggle
          v-model="edit.hasFeedback"
          :label="edit.hasFeedback ? 'Feedback' : 'No feedback'"
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
              label="Change icon"
              unelevated
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
                  autofocus
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
        <QField borderless>
          <QToggle
            v-model="edit.hasFeedbackWeight"
            label="ask for feedback weight"
          />
        </QField>
      </template>

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
</template>

<script>
import { Component as QIconPicker } from '@quasar/quasar-ui-qiconpicker'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import {
  QSelect,
  QInput,
  QField,
  QBtn,
  QBtnToggle,
  QToggle,
  QMenu,
  QIcon,
  QColor,
  QToolbar,
  QToolbarTitle,
  colors,
} from 'quasar'
import { createActivityTypeStylesheet } from '@/activities/datastore/activityTypeStylesheetPlugin'

const { getPaletteColor } = colors

export default {
  components: {
    QSelect,
    QInput,
    QField,
    QBtn,
    QBtnToggle,
    QToggle,
    QMenu,
    QIcon,
    QColor,
    // eslint-disable-next-line vue/no-unused-components
    QToolbar,
    // eslint-disable-next-line vue/no-unused-components
    QToolbarTitle,
    QIconPicker,
  },
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    activityTypes: {
      type: Array,
      required: true,
    },
  },
  data () {
    // See https://quasar.dev/style/color-palette#Color-List
    const colourNames = [
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
    const colourNumbers = [
      8,
      9,
      10,
    ]
    return {
      paletteColours: colourNumbers.flatMap(number => colourNames.map(name => getPaletteColor(`${name}-${number}`))),
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
    translatableNameOptions () {
      return [
        // alphabetical
        'Activity',
        'Distribution',
        'Event',
        'Meeting',
        'Pickup',
        'Task',
      ].map(value => ({
        value,
        label: this.$t(`ACTIVITY_TYPE_NAMES.${value}`),
        // prevent people from trying to choose a name that is already used (it's not allowed, and enforced by backend too)
        disable: this.activityTypeNamesInUse.includes(value),
      }))
    },
    activityTypeNamesInUse () {
      return this.activityTypes
        .filter(activityType => activityType.id !== this.edit.id)
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
  },
  watch: {
    'edit.colour': {
      handler () {
        // TODO: this doesn't handle yet when it doesn't have an id (new...)
        const mapping = this.updateActivityTypes([this.edit])
        console.log('got mapping!', mapping)
      },
      immediate: true,
      // deep: true,
    },
    'edit.icon' () {
      this.$refs.iconMenu.hide()
    },
    'edit.feedbackIcon' () {
      this.$refs.feedbackIconMenu.hide()
    },
    'edit.nameIsTranslatable' (nameIsTranslatable) {
      if (nameIsTranslatable) {
        // We just switched to use translatable name
        // Keep a copy of the custom value so we can restore it if nameIsTranslatable is set to false later
        this.customName = this.edit.name

        // make sure the value is one of the entries...
        if (!this.translatableNameOptions.map(option => option.value).includes(this.edit.name)) {
          this.edit.name = this.translatableNameOptions[0].value
        }
      }
      else {
        // We just switched back to custom name
        if (this.customName) {
          this.edit.name = this.customName
        }
      }
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
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    maybeSave () {
      if (!this.canSave) return
      this.save()
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
