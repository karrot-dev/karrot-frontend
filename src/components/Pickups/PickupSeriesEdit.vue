<template>
  <div class="edit" :class="{ changed: hasChanged }">

    <q-field
      icon="access time"
      :label="$t('CREATEPICKUP.TIME')"
      :helper="$t('CREATEPICKUP.TIME_HELPER')">
      <q-datetime type="time"
                  v-model="seriesEdit.startDate"
                  :format24h="is24h"
                  :display-value="$d(seriesEdit.startDate, 'timeShort')"/>
    </q-field>

    <q-field
      icon="today"
      label="Weekdays"
      helper="On which weekdays should the pick-up take place?">
      <q-select multiple toggle v-model="seriesEdit.rule.byDay" :options="dayOptions"/>
    </q-field>

    <q-field
      icon="group"
      :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
      :helper="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')">
      <q-slider v-model="seriesEdit.maxCollectors" :min="1" :max="10" label label-always />
    </q-field>

    <q-field
      icon="info"
      :label="$t('CREATEPICKUP.COMMENT')"
      :helper="$t('CREATEPICKUP.COMMENT_HELPER')">
      <q-input v-model="seriesEdit.description" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-btn color="primary" @click="save" :disable="!isNew && !hasChanged">{{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}</q-btn>
    <q-btn @click="reset" v-if="!isNew" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>
    <q-btn @click="$emit('cancel')" v-if="isNew">{{ $t('BUTTON.CANCEL') }}</q-btn>
    <q-btn color="red" @click="destroy" v-if="!isNew">{{ $t('BUTTON.DELETE') }}</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect } from 'quasar'
import { is24h, dayOptions } from '@/i18n'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    series: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QInput, QBtn, QSelect,
  },
  data () {
    return {
      seriesEdit: cloneDeep(this.series),
      lastByDay: [...this.series.rule.byDay],
    }
  },
  watch: {
    series () {
      this.reset()
    },
    // enforce having at least one day selected
    'seriesEdit.rule.byDay' (byDay) {
      if (byDay.length === 0) {
        this.seriesEdit.rule.byDay.push(...this.lastByDay)
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
      return !this.series.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.series, this.seriesEdit)
    },
  },
  methods: {
    reset () {
      this.seriesEdit = cloneDeep(this.series)
    },
    save (event) {
      if (this.isNew) {
        this.$emit('save', this.seriesEdit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.series, this.seriesEdit), id: this.series.id }, event)
      }
    },
    destroy (event) {
      this.$emit('destroy', this.series.id, event)
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
