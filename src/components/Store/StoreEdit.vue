<template>
  <div>
    <h3 v-if="isNew"><i class="fa fa-pencil"></i> {{ $t('CREATESTORE.TITLE') }}</h3>
    <h3 v-else><i class="fa fa fa-edit"></i> {{ $t('STOREDETAIL.EDIT') }}</h3>
    <q-card>
      <div class="edit" :class="{ changed: hasChanged }">
        <form @submit="save">
          <q-field
            icon="fa-star"
            :label="$t('STOREEDIT.NAME')"
            :error="!!nameError"
            :error-label="nameError">
            <q-input
              v-model="storeEdit.name"
              :autofocus="true"
              @blur="$v.storeEdit.name.$touch"
              autocomplete="off" />
          </q-field>

          <q-field
            icon="fa-question"
            :label="$t('STOREEDIT.DESCRIPTION')">
            <MarkdownInput :value="storeEdit.description">
              <q-input v-model="storeEdit.description" type="textarea" :min-rows="3" :max-height="100" />
            </MarkdownInput>
          </q-field>

          <q-field
            icon="fa-map"
            :label="$t('STOREEDIT.ADDRESS')">
            <address-picker v-model="storeEdit" :map="true"/>
          </q-field>

          <q-field
            icon="fa-calendar"
            :label="$t('STOREEDIT.WEEKS_IN_ADVANCE')">
            <q-slider v-model="storeEdit.weeksInAdvance" :min="1" :max="10" label label-always />
          </q-field>

          <div class="text-negative">{{ requestError('nonFieldErrors') }}</div>

          <q-btn type="submit" color="primary" :disable="!canSave" loader :value="status.isWaiting">
            {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
          </q-btn>
          <q-btn type="button" @click="reset" v-if="!isNew" :disable="!hasChanged">
            {{ $t('BUTTON.RESET') }}
          </q-btn>
          <q-btn type="button" @click="$emit('cancel')" v-if="isNew">
            {{ $t('BUTTON.CANCEL') }}
          </q-btn>
          <q-btn type="button" color="red" @click="destroy" v-if="!isNew">
            {{ $t('BUTTON.DELETE') }}
          </q-btn>

        </form>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect } from 'quasar'
import StandardMap from '@/components/Map/StandardMap'
import AddressPicker from '@/components/Address/AddressPicker'
import MarkdownInput from '@/components/MarkdownInput'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  name: 'StoreEdit',
  mixins: [validationMixin],
  props: {
    store: {
      required: false,
      default () {
        return {
          name: undefined,
          description: undefined,
          weeksInAdvance: 4,
          latitude: undefined,
          longitude: undefined,
          address: undefined,
        }
      },
    },
    status: { required: true },
    allStores: { required: true },
    requestError: { required: true },
  },
  components: {
    QCard, QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect, MarkdownInput, StandardMap, AddressPicker,
  },
  data () {
    return {
      storeEdit: cloneDeep(this.store),
    }
  },
  watch: {
    store () {
      this.reset()
    },
  },
  computed: {
    isNew () {
      return !this.store.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.store, this.storeEdit)
    },
    canSave () {
      if (this.$v.storeEdit.$error) {
        return false
      }
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    nameError () {
      const m = this.$v.storeEdit.name
      if (!m.required) return this.$t('VALIDATION.REQUIRED')
      if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', 2)
      if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', 81)
      if (!m.isUnique) return this.$t('VALIDATION.UNIQUE')
      return this.requestError('name')
    },
  },
  methods: {
    reset () {
      this.storeEdit = cloneDeep(this.store)
    },
    save (event) {
      this.$v.storeEdit.$touch()
      if (!this.canSave) return
      if (this.isNew) {
        this.$emit('save', this.storeEdit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.store, this.storeEdit), id: this.store.id }, event)
      }
    },
    destroy (event) {
      this.$emit('destroy', this.store.id, event)
    },
  },
  validations: {
    storeEdit: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(80),
        isUnique (value) {
          if (value === '') return true
          return this.allStores
            .filter(e => e.id !== this.storeEdit.id)
            .findIndex(e => e.name === value) < 0
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
