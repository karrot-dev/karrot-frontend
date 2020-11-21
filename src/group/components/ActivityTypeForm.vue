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
      <QToggle
        v-model="edit.status"
        label="Active"
        true-value="active"
        false-value="archived"
      />
      <QBtnToggle
        v-model="edit.status"
        :options="[
          { label: 'active', value: 'active' },
          { label: 'archived', value: 'archived' },
        ]"
      />
      <QBtnToggle
        v-model="edit.nameIsTranslatable"
        :options="[
          { label: 'Use standard name', value: true },
          { label: 'Use custom name', value: false },
        ]"
      />
      <QSelect
        v-if="edit.nameIsTranslatable"
        v-model="edit.name"
        filled
        :options="translatableNameOptions"
        :error="hasNameError"
        :error-message="nameError"
        :autofocus="!$q.platform.has.touch"
        autocomplete="off"
        @blur="$v.edit.name.$touch"
      >
        <template #before>
          <QIcon name="fas fa-fw fa-star" />
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
        @blur="$v.edit.name.$touch"
      >
        <template #before>
          <QIcon name="fas fa-fw fa-star" />
        </template>
      </QInput>``

      <QIcon
        :name="edit.icon"
        size="lg"
        :color="`activity-type-${edit.id}-edit`"
      />

      <QBtn
        label="Change icon"
        flat
        class="q-ml-sm"
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
        flat
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

      <br>

      <QToggle
        v-model="edit.hasFeedback"
        label="Has feedback"
      />

      <template v-if="edit.hasFeedback">
        <QToggle
          v-model="edit.hasFeedbackWeight"
          label="Has feedback weight"
        />

        <QIcon
          :name="edit.feedbackIcon"
          size="lg"
          :color="`activity-type-${edit.id}-edit`"
        />
        <QBtn
          label="Change icon"
          flat
          class="q-ml-sm"
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
  QBtn,
  QBtnToggle,
  QToggle,
  QMenu,
  QIcon,
  QColor,
  colors,
} from 'quasar'
import { createActivityTypeStylesheet } from '@/activities/datastore/activityTypeStylesheetPlugin'

const { getPaletteColor } = colors

export default {
  components: {
    QSelect,
    QInput,
    QBtn,
    QBtnToggle,
    QToggle,
    QMenu,
    QIcon,
    QColor,
    QIconPicker,
  },
  mixins: [validationMixin, editMixin, statusMixin],
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
      translatableNameOptions: [
        // alphabetical
        'Activity',
        'Distribution',
        'Event',
        'Meeting',
        'Pickup',
        'Task',
      ],
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
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>

<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
