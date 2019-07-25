<template>
  <div>
    <QCard style="max-width: 500px">
      <ChangePhoto
        v-if="!isNew"
        :value="value"
        :status="status"
        :label="$t('GROUP.LOGO')"
        :helper="$t('GROUP.SET_LOGO')"
        @save="$emit('save', { id: value.id, photo: arguments[0] })"
      />
      <div
        class="edit-box"
        :class="{ changed: hasChanged }"
      >
        <form @submit.prevent="maybeSave">
          <QInput
            v-if="!edit.isPlayground"
            id="group-title"
            v-model="edit.name"
            :label="$t('GROUP.TITLE')"
            :error="hasNameError"
            :error-message="nameError"
            :autofocus="true"
            autocomplete="off"
            @blur="$v.edit.name.$touch"
          >
            <template v-slot:before>
              <QIcon name="fas fa-fw fa-star" />
            </template>
          </QInput>

          <MarkdownInput
            v-if="!edit.isPlayground"
            v-model="edit.publicDescription"
            icon="fas fa-fw fa-question"
            :label="$t('GROUPINFO.TITLE')"
            :error="hasError('publicDescription')"
            :error-message="firstError('publicDescription')"
            @keyup.ctrl.enter="maybeSave"
          />

          <MarkdownInput
            v-model="edit.description"
            icon="fas fa-fw fa-address-card"
            :label="$t('GROUP.DESCRIPTION_VERBOSE')"
            :error="hasError('description')"
            :error-message="firstError('description')"
            @keyup.ctrl.enter="maybeSave"
          />

          <MarkdownInput
            v-if="!edit.isOpen"
            v-model="edit.welcomeMessage"
            icon="fas fa-fw fa-address-card"
            :label="$t('GROUP.WELCOMEMESSAGE_VERBOSE')"
            :error="hasError('welcomeMessage')"
            :error-message="firstError('welcomeMessage')"
            @keyup.ctrl.enter="maybeSave"
          />

          <AddressPicker
            v-model="edit"
            :color="isNew ? 'blue' : 'positive'"
            font-icon="fas fa-home"
            icon="fas fa-fw fa-map-marker"
            :label="$t('GROUP.ADDRESS')"
            :error="hasAddressError"
            :error-message="addressError"
          />

          <MarkdownInput
            v-if="!edit.isOpen"
            icon="fas fa-fw fa-question"
            :value="applicationQuestionsOrDefault"
            :label="$t('GROUP.APPLICATION_QUESTIONS')"
            :error="hasError('applicationQuestions')"
            :error-message="firstError('applicationQuestions')"
            @input="applicationQuestionsInput"
            @keyup.ctrl.enter="maybeSave"
          />

          <QSelect
            v-model="edit.timezone"
            :label="$t('GROUP.TIMEZONE')"
            :error="hasTimezoneError"
            :error-message="timezoneError"
            input-debounce="0"
            :options="filteredTimezones"
            use-input
            fill-input
            hide-selected
            @filter="timezoneFilter"
            @blur="$v.edit.timezone.$touch"
          >
            <template v-slot:before>
              <QIcon name="fas fa-fw fa-globe" />
            </template>
          </QSelect>

          <div
            v-if="hasNonFieldError"
            class="text-negative"
          >
            {{ firstNonFieldError }}
          </div>
          <div class="actionButtons">
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
import jstz from 'jstimezonedetect'
import {
  QCard,
  QInput,
  QBtn,
  QSelect,
  QIcon,
} from 'quasar'
import AddressPicker from '@/maps/components/AddressPicker'
import MarkdownInput from '@/utils/components/MarkdownInput'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import ChangePhoto from '@/authuser/components/Settings/ChangePhoto'

export default {
  name: 'GroupEdit',
  components: {
    QCard,
    QInput,
    QBtn,
    QSelect,
    QIcon,
    AddressPicker,
    MarkdownInput,
    ChangePhoto,
  },
  mixins: [validationMixin, editMixin, statusMixin],
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({
        name: undefined,
        publicDescription: undefined,
        description: undefined,
        timezone: jstz.determine().name(),
        latitude: undefined,
        longitude: undefined,
        address: undefined,
        applicationQuestions: undefined,
      }),
    },
    timezones: {
      type: Array,
      required: true,
    },
    allGroups: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      filteredTimezones: this.timezones,
      show: false,
    }
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
        if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', { min: 4 })
        if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
        if (!m.isUnique) return this.$t('VALIDATION.UNIQUE')
      }
      return this.firstError('name')
    },
    hasTimezoneError () {
      return !!this.timezoneError
    },
    timezoneError () {
      if (this.$v.edit.timezone.$error) {
        const m = this.$v.edit.timezone
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.inList) return this.$t('VALIDATION.VALID_TIMEZONE')
      }
      return this.firstError('timezone')
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
    applicationQuestionsOrDefault () {
      return this.edit.applicationQuestions || this.edit.applicationQuestionsDefault
    },
  },
  watch: {
    timezones (val) {
      this.filteredTimezones = val
    },
  },
  methods: {
    maybeSave (event) {
      this.$v.edit.$touch()
      if (!this.canSave) return
      this.$v.edit.$reset()
      this.save()
    },
    timezoneFilter (terms, update, abort) {
      update(() => {
        const token = terms.toLowerCase()
        this.filteredTimezones = this.timezones.filter(item => item.toLowerCase().includes(token))
      })
    },
    applicationQuestionsInput (value) {
      this.edit.applicationQuestions = value
    },
  },
  validations: {
    edit: {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(80),
        isUnique (value) {
          if (value === '' || !this.value) return true
          return this.allGroups
            .filter(e => e.id !== this.value.id)
            .findIndex(e => e.name === value) < 0
        },
      },
      timezone: {
        required,
        inList (value) {
          if (value === '') return true
          if (this.timezones && this.timezones.list) {
            return this.timezones.list.findIndex(e => e.value === value) > 0
          }
          return true
        },
      },
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
