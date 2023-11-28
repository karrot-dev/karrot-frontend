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
        <template #before>
          <QIcon
            :name="edit.icon"
            size="lg"
            :color="colorName"
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
              <QSelect
                v-model="iconTag"
                label="Tag"
                outlined
                clearable
                dense
                class="q-ma-md"
                :options="pickerTags"
              />
              <QInput
                v-model="iconFilter"
                :label="$t('BUTTON.SEARCH')"
                outlined
                dense
                clearable
                class="q-ma-md"
                :autofocus="!$q.platform.has.touch"
              />
              <QIconPicker
                v-model="edit.icon"
                v-model:model-pagination="iconPagination"
                :icons="pickerIcons"
                :filter="iconFilter"
                color="white"
                :text-color="colorName"
                :selected-color="colorName"
                selected-text-color="white"
                style="height: 220px;"
              />
            </QMenu>
          </QBtn>

          <ColourPicker v-model="edit.colour" />
        </template>
      </QField>

      <TranslatableNameInput
        v-model="edit"
        :label="$t('ACTIVITY_TYPES.NAME')"
        :error="hasNameError"
        :error-message="nameError"
        :options="translatableNameOptions"
        @blur="v$.edit.name.$touch"
      />

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
              :color="colorName"
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
                <QSelect
                  v-model="feedbackIconTag"
                  label="Tag"
                  outlined
                  clearable
                  dense
                  class="q-ma-md"
                  :options="pickerTags"
                />
                <QInput
                  v-model="feedbackIconFilter"
                  :label="$t('BUTTON.SEARCH')"
                  outlined
                  dense
                  clearable
                  class="q-ma-md"
                  :autofocus="!$q.platform.has.touch"
                />
                <QIconPicker
                  v-model="edit.feedbackIcon"
                  v-model:model-pagination="feedbackIconPagination"
                  :icons="feedbackPickerIcons"
                  :filter="feedbackIconFilter"
                  color="white"
                  :text-color="colorName"
                  :selected-color="colorName"
                  selected-text-color="white"
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
          v-if="!isNew && !value.isArchived"
          type="button"
          color="red"
          @click="archive"
        >
          {{ $t('BUTTON.ARCHIVE') }}
        </QBtn>

        <QBtn
          v-if="!isNew && value.isArchived"
          type="button"
          color="red"
          @click="restore"
        >
          {{ $t('STOREEDIT.RESTORE') }}
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
import { QIconPicker } from '@quasar/quasar-ui-qiconpicker'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {
  QSelect,
  QInput,
  QField,
  QBtn,
  QToggle,
  QMenu,
  QIcon,
} from 'quasar'

import { createActivityTypeStylesheet } from '@/activities/stylesheet'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import pickerIcons, { tags as pickerTags } from '@/utils/pickerIcons'

import ColourPicker from '@/utils/components/ColourPicker.vue'
import TranslatableNameInput from '@/utils/components/TranslatableNameInput.vue'

export default {
  components: {
    TranslatableNameInput,
    ColourPicker,
    QSelect,
    QInput,
    QField,
    QBtn,
    QToggle,
    QMenu,
    QIcon,
    QIconPicker,
  },
  mixins: [editMixin, statusMixin],
  props: {
    activityTypes: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'cancel',
  ],
  setup () {
    return {
      v$: useVuelidate(),
    }
  },
  data () {
    return {
      customName: '',
      colorName: null,
      iconTag: null,
      iconFilter: '',
      iconPagination: {
        itemsPerPage: 20,
        page: 0,
      },
      feedbackIconTag: null,
      feedbackIconFilter: '',
      feedbackIconPagination: {
        itemsPerPage: 20,
        page: 0,
      },
    }
  },
  computed: {
    pickerIcons () {
      if (!this.iconTag) return pickerIcons
      return pickerIcons.filter(icon => icon.tags.includes(this.iconTag))
    },
    feedbackPickerIcons () {
      if (!this.feedbackIconTag) return pickerIcons
      return pickerIcons.filter(icon => icon.tags.includes(this.iconTag))
    },
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    translatableNameOptions () {
      return [
        // alphabetical
        'Activity',
        'Distribution',
        'Event',
        'Meeting',
        'Pickup',
        'Task',
      ].map(name => ({
        name,
        label: this.$t(`ACTIVITY_TYPE_NAMES.${name}`),
        disable: this.activityTypeNamesInUse.includes(name),
      }))
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
      if (this.v$.edit.name.$error) {
        const m = this.v$.edit.name
        if (m.required.$invalid) return this.$t('VALIDATION.REQUIRED')
        if (m.isUnique.$invalid) return this.$t('VALIDATION.UNIQUE')
      }
      return this.firstError('name')
    },
  },
  watch: {
    'edit.colour': {
      handler () {
        // Keep our activity type class names up to date!
        this.colorName = this.updateEntry(this.edit)
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
  created () {
    this.pickerTags = pickerTags
  },
  beforeCreate () {
    const { updateEntry, removeStylesheet } = createActivityTypeStylesheet('-edit')
    Object.assign(this, {
      updateEntry,
      removeStylesheet,
    })
  },
  beforeUnmount () {
    this.removeStylesheet()
  },
  methods: {
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    archive () {
      this.$emit('save', { id: this.value.id, isArchived: true })
    },
    restore () {
      this.$emit('save', { id: this.value.id, isArchived: false })
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

<style scoped lang="sass">
@import 'editbox'
</style>

<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
