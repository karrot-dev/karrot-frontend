<template>
  <div class="edit" :class="{ changed: hasChanged }">
    <form @submit.prevent="save">
      <q-field
        icon="access time"
        :label="$t('CREATEPICKUP.TIME')"
        :helper="$t('CREATEPICKUP.TIME_HELPER')"
        :error="hasError('time')"
        :error-label="firstError('time')"
        >
        <q-datetime type="time"
                    v-model="edit.date"
                    :format24h="is24h"
                    :display-value="$d(edit.date, 'timeShort')"/>
      </q-field>

      <q-field
        icon="today"
        :label="$t('CREATEPICKUP.DATE')"
        :helper="$t('CREATEPICKUP.DATE_HELPER')"
        :error="hasError('date')"
        :error-label="firstError('date')"
        >
        <q-datetime type="date" v-model="edit.date" :display-value="$d(edit.date, 'dateShort')"/>
      </q-field>

      <q-field
        icon="group"
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :error="hasError('maxCollectors')"
        :error-label="firstError('maxCollectors')"
        >
        <q-slider v-model="edit.maxCollectors" :min="1" :max="10" label label-always />
      </q-field>

      <q-field
        icon="info"
        :label="$t('CREATEPICKUP.COMMENT')"
        :helper="$t('CREATEPICKUP.COMMENT_HELPER')"
        :error="hasError('description')"
        :error-label="firstError('description')"
        >
        <q-input v-model="edit.description" type="textarea" :min-rows="1" :max-height="100" />
      </q-field>

      <div class="text-negative">{{ firstError('nonFieldErrors') }}</div>

      <q-btn type="submit" color="primary" :disable="!isNew && !hasChanged" loader :value="status.pending">{{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}</q-btn>
      <q-btn type="button" @click="reset" v-if="!isNew" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>
      <q-btn type="button" @click="$emit('cancel')" v-if="isNew">{{ $t('BUTTON.CANCEL') }}</q-btn>
      <q-btn type="button" color="red" @click="destroy" v-if="!isNew" :disabled="pickup.collectorIds.length !== 0">{{ $t('BUTTON.DELETE') }}</q-btn>
    </form>
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
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect,
  },
  data () {
    const source = this.pickup.id ? this.pickup.__unenriched : this.pickup
    return {
      source,
      edit: cloneDeep(source),
    }
  },
  watch: {
    'pickup.__unenriched' (curr, prev) {
      // we want to make sure it's _really_ changed or we risk undoing the users changes
      if (curr !== prev || !deepEqual(curr, prev)) this.reset()
    },
  },
  computed: {
    is24h,
    isNew () {
      return !this.source.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.source, this.edit)
    },
  },
  methods: {
    hasError (field) {
      return !!this.status.validationErrors[field]
    },
    firstError (field) {
      const errors = this.status.validationErrors[field]
      return errors && errors[0]
    },
    reset () {
      this.source = this.source.id ? this.pickup.__unenriched : this.pickup
      this.edit = cloneDeep(this.source)
      this.$emit('reset', this.source.id)
    },
    save (event) {
      if (this.isNew) {
        this.$emit('save', this.edit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.source, this.edit), id: this.source.id }, event)
      }
    },
    destroy (event) {
      this.$emit('destroy', this.source.id, event)
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
