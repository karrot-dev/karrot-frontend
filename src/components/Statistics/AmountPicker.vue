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
    <div>
      <q-slider
        :value="value"
        @input="$emit('input', arguments[0])"
        :min="0"
        :max="70"
        :step="0.5"
        label
        snap
      />
    </div>
  </div>
</template>

<script>
import { QSlider } from 'quasar'
import AmountViewer from './AmountViewer'
import AmountBox from './AmountBox'

export default {
  props: { value: { default: 0, type: Number } },
  components: { QSlider, AmountViewer, AmountBox },
}
</script>

<style scoped lang="stylus">
</style>
