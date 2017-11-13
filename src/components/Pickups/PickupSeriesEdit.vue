<template>
  <div class="edit" :class="{ changed: hasChanged }">
    <form @submit.prevent="save">
      <q-field
        icon="access time"
        :label="$t('CREATEPICKUP.TIME')"
        :helper="$t('CREATEPICKUP.TIME_HELPER')"
        :error="hasError('startDate')"
        :error-label="firstError('startDate')"
        >
        <q-datetime type="time"
                    v-model="edit.startDate"
                    :format24h="is24h"
                    :display-value="$d(edit.startDate, 'timeShort')"/>
      </q-field>

      <q-field
        icon="today"
        :label="$t('CREATEPICKUP.WEEKDAYS')"
        :helper="$t('CREATEPICKUP.WEEKDAYS_HELPER')"
        :error="hasError('rule')"
        :error-label="firstError('rule')"
        >
        <q-select multiple toggle v-model="edit.rule.byDay" :options="dayOptions"/>
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
      <q-btn type="button" color="red" @click="destroy" v-if="!isNew">{{ $t('BUTTON.DELETE') }}</q-btn>
    </form>
  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect, Dialog } from 'quasar'
import { is24h, dayOptions } from '@/i18n'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    series: { required: true },
    status: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect,
  },
  data () {
    const source = this.series.id ? this.series.__unenriched : this.series
    return {
      source,
      edit: cloneDeep(source),
      lastByDay: [...this.series.rule.byDay],
    }
  },
  watch: {
    'series.__unenriched' (curr, prev) {
      // we want to make sure it's _really_ changed or we risk undoing the users changes
      if (curr !== prev || !deepEqual(curr, prev)) this.reset()
    },
    // enforce having at least one day selected
    'edit.rule.byDay' (byDay) {
      if (byDay.length === 0) {
        this.edit.rule.byDay.push(...this.lastByDay)
      }
      else {
        this.lastByDay = [...byDay]
      }
    },
  },
  computed: {
    dayOptions,
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
      this.source = this.source.id ? this.series.__unenriched : this.series
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
      Dialog.create({
        title: this.$t('PICKUPDELETE.DELETE_SERIES_TITLE'),
        message: this.$t('PICKUPDELETE.DELETE_SERIES_TEXT'),
        buttons: [
          this.$t('BUTTON.CANCEL'),
          {
            label: this.$t('BUTTON.YES'),
            handler: () => {
              this.$emit('destroy', this.source.id, event)
            },
          },
        ],
      })
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
