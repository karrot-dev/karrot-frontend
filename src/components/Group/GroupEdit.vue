<template>
  <div class="edit" :class="{ changed: hasChanged }">

    <q-field
      icon="fa-star"
      :label="$t('GROUP.TITLE')">
      <q-input v-model="groupEdit.name" :autofocus="true"/>
    </q-field>

    <q-field
      icon="fa-star"
      :label="$t('GROUP.PASSWORD')">
      <q-input v-model="groupEdit.password"/>
    </q-field>

    <q-field
      icon="fa-star"
      :label="$t('GROUP.TIMEZONE')">
      <q-input v-model="groupEdit.timezone">
        <q-autocomplete :static-data="timezones" :max-results="10" :debounce="300" />
      </q-input>
    </q-field>

    <q-field
      icon="fa-wheelchair"
      :label="$t('GROUP.PUBLIC_DESCRIPTION')">
      <q-input v-model="groupEdit.publicDescription" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-field
      icon="fa-wheelchair"
      :label="$t('GROUP.DESCRIPTION_VERBOSE')">
      <q-input v-model="groupEdit.description" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-field
      icon="fa-map"
      :label="$t('GROUP.ADDRESS')">
      <address-picker v-model="groupEdit" :map="true"/>
    </q-field>

    <q-btn color="primary" @click="save" :disable="!isNew && !hasChanged">{{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}</q-btn>
    <q-btn @click="reset" v-if="!isNew" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>
    <q-btn @click="$emit('cancel')" v-if="isNew">{{ $t('BUTTON.CANCEL') }}</q-btn>

    <pre>
      {{ status.error }}
    </pre>

  </div>
</template>

<script>
import { QField, QInput, QBtn, QAutocomplete } from 'quasar'
import StandardMap from '@/components/Map/StandardMap'
import AddressPicker from '@/components/Address/AddressPicker'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  name: 'groupEdit',
  props: {
    group: {
      required: false,
      default () {
        return {
          name: null,
          password: null,
          publicDescription: null,
          description: null,
          timezone: 'Europe/Berlin', // TODO replace with jstimezonedetect on create
          latitude: null,
          longitude: null,
          address: null,
        }
      },
    },
    status: { required: true },
    timezones: { required: true },
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
  },
  methods: {
    reset () {
      this.groupEdit = cloneDeep(this.group)
    },
    save (event) {
      if (this.isNew) {
        this.$emit('save', this.groupEdit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.group, this.groupEdit), id: this.group.id }, event)
      }
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
