<template>
  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-field
        icon="access time"
        label="Time"
        helper="When should the pick-up take place?"
      >
        <q-inline-datetime color="amber" v-model="time" type="time" format24h />
      </q-field>
      <q-field
        icon="today"
        label="Weekdays"
        helper="On which weekdays should the pick-up take place?"
      >
        <q-option-group
          type="checkbox"
          v-model="weekdays"
          :options="[
            { label: 'Monday', value: 'MO' },
            { label: 'Tuesday', value: 'TU' },
            { label: 'Wednesday', value: 'WE' },
            { label: 'Thursday', value: 'TH' },
            { label: 'Friday', value: 'FR' },
            { label: 'Saturday', value: 'SA' },
            { label: 'Sunday', value: 'SU' },
          ]"
        />
      </q-field>
      <q-field
        icon="group"
        label="Max Collectors"
        helper="How many people should participate in the pick-up?"
      >
        <q-slider v-model="maxCollectors" :min="0" :max="10" label />
      </q-field>
      <q-field
        icon="info"
        label="Additional information"
        helper="What should people know when signing up to this pick-up?"
      >
        <q-input v-model="description" />
      </q-field>
      <QBtn color="primary" @click="submitForm">
        Submit
      </QBtn>
    </div>
  </div>
</template>

<script>
import { QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn } from 'quasar'

export default {
  props: [],
  components: {
    QInlineDatetime, QField, QSlider, QOptionGroup, QInput, QBtn
  },
  data () {
    return {
      time: new Date(),
      weekdays: [],
      maxCollectors: 2,
      description: ''
    }
  },
  methods: {
    submitForm (event) {
      this.$emit('submit', {
        time: this.time,
        weekdays: this.weekdays,
        maxCollectors: this.maxCollectors,
        description: this.description
      }, event)
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
