<template>
  <div class="edit" :class="{ changed: hasChanged }">

    <q-field
      icon="access time"
      label="Time"
      helper="When should the pick-up take place?">
      <q-datetime type="time" v-model="seriesEdit.startDate"/>
    </q-field>

    <q-field
      icon="today"
      label="Weekdays"
      helper="On which weekdays should the pick-up take place?">
      <q-option-group
        inline
        type="toggle"
        v-model="seriesEdit.rule.byDay"
        :options="dayOptions" />
    </q-field>

    <q-field
      icon="group"
      label="Max Collectors"
      helper="How many people should participate in the pick-up?">
      <q-slider v-model="seriesEdit.maxCollectors" :min="1" :max="10" label label-always />
    </q-field>

    <q-field
      icon="info"
      label="Additional information"
      helper="What should people know when signing up to this pick-up?">
      <q-input v-model="seriesEdit.description" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-btn color="primary" @click="save" :disable="!hasChanged">Save changes</q-btn>
    <q-btn @click="reset" :disable="!hasChanged">Reset</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn } from 'quasar'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    series: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn,
  },
  data () {
    return {
      seriesEdit: cloneDeep(this.series),
    }
  },
  computed: {
    hasChanged () {
      return !deepEqual(this.series, this.seriesEdit)
    },
    dayOptions () {
      return [
        { label: 'Monday', value: 'MO' },
        { label: 'Tuesday', value: 'TU' },
        { label: 'Wednesday', value: 'WE' },
        { label: 'Thursday', value: 'TH' },
        { label: 'Friday', value: 'FR' },
        { label: 'Saturday', value: 'SA' },
        { label: 'Sunday', value: 'SU' },
      ]
    },
  },
  methods: {
    reset () {
      this.seriesEdit = cloneDeep(this.series)
    },
    save (event) {
      this.$emit('save', objectDiff(this.series, this.seriesEdit), event)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
button.selected
  background-color $grey-4
.edit
  padding 20px // $item-padding
  background-color $grey-1
  &.changed
    background-color $yellow-1
</style>
