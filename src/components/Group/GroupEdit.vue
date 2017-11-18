<template>
  <div>
    <q-card>
      <div class="edit" :class="{ changed: hasChanged }">
        <form @submit.prevent="checkSave">
          <q-field
            icon="fa-fw fa-star"
            :label="$t('GROUP.TITLE')"
            :error="!!nameError"
            :error-label="nameError"
            >
            <q-input
              id="group-title"
              v-model="edit.name"
              :autofocus="true"
              @blur="$v.edit.name.$touch"
              autocomplete="off"
              />
          </q-field>

          <q-field
            icon="fa-fw fa-question"
            :label="$t('GROUP.PUBLIC_DESCRIPTION')">
            <MarkdownInput :value="edit.publicDescription">
              <q-input
                v-model="edit.publicDescription"
                type="textarea"
                :min-rows="3"
              />
            </MarkdownInput>
          </q-field>

          <q-field
            icon="fa-fw fa-vcard"
            :label="$t('GROUP.DESCRIPTION_VERBOSE')"
            >
            <MarkdownInput :value="edit.description">
              <q-input
                v-model="edit.description"
                type="textarea"
                :min-rows="3"
              />
            </MarkdownInput>
          </q-field>

          <q-field
            icon="fa-fw fa-map"
            :label="$t('GROUP.ADDRESS')"
            >
            <address-picker
              v-model="edit"
              :map="true"
            />
          </q-field>

          <q-field
            icon="fa-fw fa-question"
            :label="$t('GROUP.PASSWORD')"
            >
            <q-input v-model="edit.password"/>
          </q-field>

          <q-field
            icon="fa-fw fa-globe"
            :label="$t('GROUP.TIMEZONE')"
            :error="!!timezoneError"
            :error-label="timezoneError"
            >
            <q-input
              v-model="edit.timezone"
              @blur="$v.edit.timezone.$touch"
              >
              <q-autocomplete :static-data="timezones" :max-results="10" :debounce="300" :filter="timezoneFilter"/>
            </q-input>
          </q-field>

          <div class="text-negative">{{ firstError('nonFieldErrors') }}</div>

          <q-btn class="actionButton" type="button" @click="reset" v-if="!isNew" :disable="!hasChanged">
            {{ $t('BUTTON.RESET') }}
          </q-btn>

          <q-btn class="actionButton" type="submit" color="primary" :disable="!canSave" :loader="status.pending">
            {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
          </q-btn>
          <div style="clear: both"/>
        </form>
      </div>
    </q-card>
  </div>
</template>

<script>
import jstz from 'jstimezonedetect'
import { QCard, QField, QInput, QBtn, QAutocomplete } from 'quasar'
import StandardMap from '@/components/Map/StandardMap'
import AddressPicker from '@/components/Address/AddressPicker'
import MarkdownInput from '@/components/MarkdownInput'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import editMixin from '@/mixins/editMixin'

export default {
  name: 'GroupEdit',
  mixins: [validationMixin, editMixin],
  props: {
    status: {
      required: false,
      default: () => ({ pending: false, validationErrors: {} }),
    },
    timezones: { required: true },
    allGroups: { required: true },
  },
  components: {
    QCard, QField, QInput, QBtn, QAutocomplete, StandardMap, AddressPicker, MarkdownInput,
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
    nameError () {
      const m = this.$v.edit.name
      if (!m.required) return this.$t('VALIDATION.REQUIRED')
      if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', 4)
      if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', 81)
      if (!m.isUnique) return this.$t('VALIDATION.UNIQUE')
      return this.firstError('name')
    },
    timezoneError () {
      const m = this.$v.edit.timezone
      if (!m.required) return this.$t('VALIDATION.REQUIRED')
      if (!m.inList) return this.$t('VALIDATION.VALID_TIMEZONE')
      return this.firstError('timezone')
    },
  },
  methods: {
    reset () {
      this.source = this.source.id ? this.group.__unenriched : this.group
      this.edit = cloneDeep(this.source)
      this.$emit('reset', this.source.id)
    },
    checkSave (event) {
      this.$v.edit.$touch()
      if (!this.canSave) return
      this.save()
    },
    timezoneFilter (terms, { field, list }) {
      const token = terms.toLowerCase()
      return list.filter(item => item[field].toLowerCase().includes(token))
    },
    firstError (field) {
      const errors = this.status.validationErrors[field]
      return errors && errors[0]
    },
  },
  validations: {
    edit: {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(80),
        isUnique (value) {
          if (value === '' || !this.source) return true
          return this.allGroups
            .filter(e => e.id !== this.source.id)
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
@import '~variables'
.edit
  width 100%
  padding 20px
  &.changed
    background-color $yellow-1
.actionButton
  float: right
  margin: 2px
</style>
