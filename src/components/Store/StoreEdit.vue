<template>
  <div class="edit" :class="{ changed: hasChanged }">

    <q-field
      icon="fa-star"
      :label="$t('STOREEDIT.NAME')">
      <q-input v-model="storeEdit.name"/>
    </q-field>

    <q-field
      icon="fa-wheelchair"
      :label="$t('STOREEDIT.DESCRIPTION')">
      <q-input v-model="storeEdit.description" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-field
      icon="fa-calendar"
      :label="$t('STOREEDIT.WEEKS_IN_ADVANCE')">
      <q-slider v-model="storeEdit.weeksInAdvance" :min="1" :max="10" label label-always />
    </q-field>

    <q-field
      icon="fa-map"
      :label="$t('STOREEDIT.ADDRESS')">
      <address-picker v-model="storeEdit" :map="true"/>
    </q-field>

    <q-btn color="primary" @click="save" :disable="!isNew && !hasChanged">{{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}</q-btn>
    <q-btn @click="reset" v-if="!isNew" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>
    <q-btn @click="$emit('cancel')" v-if="isNew">{{ $t('BUTTON.CANCEL') }}</q-btn>
    <q-btn color="red" @click="destroy" v-if="!isNew">{{ $t('BUTTON.DELETE') }}</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect } from 'quasar'
import StandardMap from '@/components/Map/StandardMap'
import AddressPicker from '@/components/Address/AddressPicker'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  name: 'StoreEdit',
  props: {
    store: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect, StandardMap, AddressPicker,
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
  },
  methods: {
    reset () {
      this.storeEdit = cloneDeep(this.store)
    },
    save (event) {
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
