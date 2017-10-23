<template>
  <div class="edit" :class="{ changed: hasChanged }">
    <form @submit="save">
      <q-field
        icon="fa-star"
        :label="$t('GROUP.TITLE')"
        :error="$v.groupEdit.name.$error"
        :error-label="nameErrorMessage"
        >
        <q-input
          v-model="groupEdit.name"
          :autofocus="true"
          @blur="$v.groupEdit.name.$touch"
          autocomplete="off"
          />
      </q-field>

      <q-field
        icon="fa-question"
        :label="$t('GROUP.PUBLIC_DESCRIPTION')">
        <q-input
          v-model="groupEdit.publicDescription"
          type="textarea"
          :min-rows="3"
          :max-height="100"
        />
      </q-field>

      <q-field
        icon="fa-question"
        :label="$t('GROUP.DESCRIPTION_VERBOSE')"
        >
        <q-input
          v-model="groupEdit.description"
          type="textarea"
          :min-rows="3"
          :max-height="100"
        />
      </q-field>

      <q-field
        icon="fa-map"
        :label="$t('GROUP.ADDRESS')"
        >
        <address-picker
          v-model="groupEdit"
          :map="true"
        />
      </q-field>

      <q-field
        icon="fa-question"
        :label="$t('GROUP.PASSWORD')"
        >
        <q-input v-model="groupEdit.password"/>
      </q-field>

      <q-field
        icon="fa-globe"
        :label="$t('GROUP.TIMEZONE')"
        :error="$v.groupEdit.timezone.$error"
        error-label="Enter a valid timezone"
        >
        <q-input
          v-model="groupEdit.timezone"
          @blur="$v.groupEdit.timezone.$touch"
          >
          <q-autocomplete :static-data="timezones" :max-results="10" :debounce="300" />
        </q-input>
      </q-field>

      <q-btn type="submit" color="primary" :disable="!canSave">
        {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
      </q-btn>
      <q-btn type="button" @click="reset" v-if="!isNew" :disable="!hasChanged">
        {{ $t('BUTTON.RESET') }}
      </q-btn>
      <q-btn type="button" @click="$emit('cancel')" v-if="isNew">
        {{ $t('BUTTON.CANCEL') }}
      </q-btn>

      <pre>
        {{ status.error }}
      </pre>
    </form>
  </div>
</template>

<script>
import { QField, QInput, QBtn, QAutocomplete } from 'quasar'
import StandardMap from '@/components/Map/StandardMap'
import AddressPicker from '@/components/Address/AddressPicker'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  name: 'groupEdit',
  mixins: [validationMixin],
  props: {
    group: {
      required: false,
      default () {
        return {
          name: undefined,
          password: undefined,
          publicDescription: undefined,
          description: undefined,
          timezone: 'Europe/Berlin', // TODO replace with jstimezonedetect on create
          latitude: undefined,
          longitude: undefined,
          address: undefined,
        }
      },
    },
    status: { required: true },
    timezones: { required: true },
    allGroups: { required: true },
  },
  components: {
    QField, QInput, QBtn, QAutocomplete, StandardMap, AddressPicker,
  },
  data () {
    return {
      groupEdit: cloneDeep(this.group),
    }
  },
  watch: {
    group () {
      this.reset()
    },
  },
  computed: {
    isNew () {
      return !this.group.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.group, this.groupEdit)
    },
    canSave () {
      if (this.$v.groupEdit.$error) {
        return false
      }
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    nameErrorMessage () {
      // TODO make nicer (have a look at InvitationsUI.vue)
      return JSON.stringify(this.$v.groupEdit.name)
    },
  },
  methods: {
    reset () {
      this.groupEdit = cloneDeep(this.group)
    },
    save (event) {
      this.$v.groupEdit.$touch()
      if (!this.canSave) return
      if (this.isNew) {
        this.$emit('save', this.groupEdit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.group, this.groupEdit), id: this.group.id }, event)
      }
    },
  },
  validations: {
    groupEdit: {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(80),
        isUnique (value) {
          if (value === '') return true
          return this.allGroups
            .filter(e => e.id !== this.groupEdit.id)
            .findIndex(e => e.name === value) < 0
        },
      },
      timezone: {
        required,
        inList (value) {
          return this.timezones.list.findIndex(e => e.value === value) > 0
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
</style>
