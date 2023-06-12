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
        {{ $t('PLACE_TYPES.ADD') }}
      </h3>
      <QField
        v-if="!isNew"
        borderless
        :hint="$t(`PLACE_TYPES.STATUS_${edit.status.toUpperCase()}_HINT`)"
      >
        <template #control>
          <QToggle
            v-model="edit.status"
            :label="$t(`PLACE_TYPE_STATUS.${edit.status.toUpperCase()}`)"
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
            color="positive"
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
                text-color="positive"
                selected-color="positive"
                selected-text-color="white"
                style="height: 220px;"
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
        :label="$t('PLACE_TYPES.NAME')"
        :options="translatableNameOptions"
        :error="hasNameError"
        :error-message="nameError"
        autocomplete="off"
        type="input"
        :hint="edit.nameIsTranslatable ? $t('PLACE_TYPES.STANDARD_NAME_HINT') : $t('PLACE_TYPES.CUSTOM_NAME_HINT')"
        @blur="v$.edit.name.$touch"
        @input-value="onNameInput"
        @keyup.enter="() => $refs.nameInput.hidePopup()"
      >
        <template #option="{ index, itemProps, opt: { label: itemLabel, useCustomName } }">
          <QItem
            :key="index"
            v-bind="itemProps"
          >
            <QItemSection>
              <QItemLabel v-if="useCustomName">
                <i18n-t
                  v-if="itemLabel && !edit.nameIsTranslatable"
                  keypath="PLACE_TYPES.CUSTOM_NAME_USE"
                >
                  <template #name>
                    <strong>{{ itemLabel }}</strong>
                  </template>
                </i18n-t>
                <span v-else>
                  {{ $t('PLACE_TYPES.CUSTOM_NAME_PROMPT') }}
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
              {{ $t('PLACE_TYPES.STANDARD_NAME_HEADING') }}
            </QItemLabel>
          </template>
        </template>
      </QSelect>

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
  QItem,
  QItemSection,
  QItemLabel,
  QSeparator,
} from 'quasar'

import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import pickerIcons, { tags as pickerTags } from '@/utils/pickerIcons'

export default {
  components: {
    QSelect,
    QInput,
    QField,
    QBtn,
    QToggle,
    QMenu,
    QIcon,
    QIconPicker,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
  },
  mixins: [editMixin, statusMixin],
  props: {
    placeTypes: {
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
      iconTag: null,
      iconFilter: '',
      iconPagination: {
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
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    translatableNames () {
      return [
        'Unspecified',
        'Store',
        'Sharing Point',
        'Meeting Place',
        'Restaurant',
        'Market',
      ]
    },
    translatableNameOptions () {
      return [
        {
          value: this.edit.name,
          label: this.edit.name && this.edit.nameIsTranslatable ? this.$t(`PLACE_TYPE_NAMES.${this.edit.name}`) : this.edit.name,
          useCustomName: true,
          disable: this.edit.nameIsTranslatable,
        },
        ...this.translatableNames.map((value, idx) => ({
          value,
          label: this.$t(`PLACE_TYPE_NAMES.${value}`),
          // prevent people from trying to choose a name that is already used (it's not allowed, and enforced by backend too)
          disable: this.placeTypeNamesInUse.includes(value),
        })),
      ]
    },
    placeTypeNamesInUse () {
      return this.placeTypes
        .filter(placeType => placeType.id && placeType.id !== this.edit.id)
        .map(placeType => placeType.name)
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
  created () {
    this.pickerTags = pickerTags
  },
  methods: {
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    onNameInput (value) {
      // See if the user typed in a standard name
      const option = this.translatableNameOptions.find(option =>
        // (ignore the "special" option)
        !option.useCustomName && (
          // check if it matches the translated value
          option.label === value ||
          // or the non-translated value
          option.value === value
        ),
      )
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
          return !this.placeTypeNamesInUse.includes(value)
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
