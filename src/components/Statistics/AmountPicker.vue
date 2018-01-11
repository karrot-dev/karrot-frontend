<template>
  <div class="wrapper">
    <div class="row no-wrap">
      <AmountBox
        class="amount"
        :amount="value"
      />
      <div style="margin-left: .6em">
        <div
          v-t="'PICKUP_FEEDBACK.AMOUNT'"
          style="padding-bottom: .3em"
        />
        <AmountViewer
          v-if="!$q.platform.is.mobile"
          :amount="value"
        />
      </div>
    </div>
    <div class="row no-wrap">
      <q-slider
        :value="limitedValue"
        @input="$emit('input', arguments[0])"
        :min="0"
        :max="70"
        :step="0.5"
        label
        snap
      />
      <!-- don't use type="number" here because browsers might enforce different decimal setting
       depending on browser locale-->
      <q-input
        style="width: 5em; margin: 0 5px 0 2em; text-align: right"
        v-model="valueToNumber"
        align="right"
      />
      <span style="padding: 3px">kg</span>
    </div>
  </div>
</template>

<script>
import { QInput, QSlider } from 'quasar'
import AmountViewer from './AmountViewer'
import AmountBox from './AmountBox'

export default {
  props: { value: { default: 0, type: Number } },
  components: { QInput, QSlider, AmountViewer, AmountBox },
  computed: {
    limitedValue: {
      get () {
        return Math.min(70, this.value)
      },
      set (v) {
        this.value = v
      },
    },
    valueToNumber: {
      get () {
        return this.value
      },
      set (v) {
        const value = parseFloat(v, 10)
        this.value = isNaN(value) ? 0 : Math.max(0, value)
      },
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
