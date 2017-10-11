<template>
  <div class="edit" :class="{ changed: hasChanged }">

    <q-field
      icon="access time"
      label="Time"
      helper="When should the pick-up take place?">
      <q-datetime type="datetime" v-model="pickupEdit.date"/>
    </q-field>

    <q-field
      icon="group"
      label="Max Collectors"
      helper="How many people should participate in the pick-up?">
      <q-slider v-model="pickupEdit.maxCollectors" :min="1" :max="10" label label-always />
    </q-field>

    <q-field
      icon="info"
      label="Additional information"
      helper="What should people know when signing up to this pick-up?">
      <q-input v-model="pickupEdit.description" type="textarea" :min-rows="1" :max-height="100" />
    </q-field>

    <q-btn color="primary" @click="save" :disable="!hasChanged">Save changes</q-btn>
    <q-btn @click="reset" :disable="!hasChanged">Reset</q-btn>

  </div>
</template>

<script>
import { QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect } from 'quasar'

import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  name: 'PickupEdit',
  props: {
    pickup: { required: true },
  },
  components: {
    QDatetime, QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn, QSelect,
  },
  data () {
    return {
      pickupEdit: cloneDeep(this.pickup),
    }
  },
  computed: {
    hasChanged () {
      return !deepEqual(this.pickup, this.pickupEdit)
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
      this.pickupEdit = cloneDeep(this.pickup)
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
