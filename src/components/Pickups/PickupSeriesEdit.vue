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
    <q-select
      multiple
      toggle
      v-model="seriesEdit.rule.byDay"
      :options="dayOptions" />
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

    <q-btn color="primary" @click="save" :disable="!hasChanged">{{ $t('BUTTON.SAVE_CHANGES') }}</q-btn>
    <q-btn @click="reset" :disable="!hasChanged">{{ $t('BUTTON.RESET') }}</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect } from 'quasar'
import { is24h, dayOptions } from '@/i18n'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    series: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect,
  },
  data () {
    return {
      seriesEdit: cloneDeep(this.series),
    }
  },
  computed: {
    dayOptions,
    is24h,
    hasChanged () {
      return !deepEqual(this.series, this.seriesEdit)
    },
  },
  methods: {
    reset () {
      this.seriesEdit = cloneDeep(this.series)
    },
    save (event) {
      this.$emit('save', { ...objectDiff(this.series, this.seriesEdit), id: this.series.id }, event)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
button.selected
  background-color $grey-4
.edit
  width 100%
  padding 20px
  background-color $grey-1
  &.changed
    background-color $yellow-1
</style>
