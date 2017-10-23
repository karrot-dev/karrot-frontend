<template>
  <div class="edit" :class="{ changed: hasChanged }">
    <div class="text-negative">{{ error('nonFieldErrors') }}</div>
    <q-field
      icon="access time"
      :label="$t('CREATEPICKUP.TIME')"
      :helper="$t('CREATEPICKUP.TIME_HELPER')"
      :error="!!error('time')"
      :error-label="error('time')"
      >
      <q-datetime type="time"
                  v-model="pickupEdit.date"
                  :format24h="is24h"
                  :display-value="$d(pickupEdit.date, 'timeShort')"/>
    </q-field>

    <q-field
      icon="today"
      :label="$t('CREATEPICKUP.DATE')"
      :helper="$t('CREATEPICKUP.DATE_HELPER')"
      :error="!!error('date')"
      :error-label="error('date')"
      >
      <q-datetime type="date" v-model="pickupEdit.date" :display-value="$d(pickupEdit.date, 'dateShort')"/>
    </q-field>

    <q-field
      icon="group"
      :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
      :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
      :error="!!error('maxCollectors')"
      :error-label="error('maxCollectors')"
      >
      <q-slider v-model="pickupEdit.maxCollectors" :min="1" :max="10" label label-always />
    </q-field>

    <q-field
      icon="info"
      :label="$t('CREATEPICKUP.COMMENT')":helper="$t('CREATEPICKUP.COMMENT_HELPER')"
      :error="!!error('description')"
      :error-label="error('description')"
      >
      <q-input v-model="pickupEdit.description" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-btn color="primary" @click="save" :disable="!isNew && !hasChanged">{{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}</q-btn>
    <q-btn @click="reset" v-if="!isNew" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>
    <q-btn @click="$emit('cancel')" v-if="isNew">{{ $t('BUTTON.CANCEL') }}</q-btn>
    <q-btn color="red" @click="destroy" v-if="!isNew && !pickup.series">{{ $t('BUTTON.DELETE') }}</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect } from 'quasar'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'
import { is24h } from '@/i18n'

export default {
  name: 'PickupEdit',
  props: {
    pickup: { required: true },
    status: { required: true },
    error: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect,
  },
  data () {
    return {
      pickupEdit: cloneDeep(this.pickup),
    }
  },
  watch: {
    pickup () {
      this.reset()
    },
  },
  computed: {
    is24h,
    isNew () {
      return !this.pickup.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.pickup, this.pickupEdit)
    },
  },
  methods: {
    reset () {
      this.pickupEdit = cloneDeep(this.pickup)
    },
    save (event) {
      if (this.isNew) {
        this.$emit('save', this.pickupEdit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.pickup, this.pickupEdit), id: this.pickup.id }, event)
      }
    },
    destroy (event) {
      this.$emit('destroy', this.pickup.id, event)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.edit
  width 100%
  padding 20px
  background-color $grey-1
  &.changed
    background-color $yellow-1
</style>
