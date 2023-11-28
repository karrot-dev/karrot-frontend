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

      <TranslatableNameInput
        v-model="edit"
        :label="$t('ACTIVITY_TYPES.NAME')"
        :error="hasNameError"
        :error-message="nameError"
        :options="translatableNameOptions"
        @blur="v$.edit.name.$touch"
      />

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
  QMenu,
  QIcon,
} from 'quasar'

import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import pickerIcons, { tags as pickerTags } from '@/utils/pickerIcons'

import TranslatableNameInput from '@/utils/components/TranslatableNameInput.vue'

export default {
  components: {
    TranslatableNameInput,
    QSelect,
    QInput,
    QField,
    QBtn,
    QMenu,
    QIcon,
    QIconPicker,
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
    translatableNameOptions () {
      return [
        'Unspecified',
        'Store',
        'Sharing Point',
        'Meeting Place',
        'Restaurant',
        'Market',
      ].map(name => ({
        name,
        label: this.$t(`PLACE_TYPE_NAMES.${name}`),
        disable: this.placeTypeNamesInUse.includes(name),
      }))
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
