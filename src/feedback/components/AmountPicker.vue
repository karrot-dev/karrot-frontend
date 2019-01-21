<template>
  <div
    class="wrapper"
    :class="{showOverlay}"
  >
    <QBtn
      v-if="showOverlay"
      class="absolute-center"
      style="z-index: 1"
      color="primary"
      @click="valueToNumber = 0"
      v-t="'PICKUP_FEEDBACK.SET_AMOUNT'"
    />
    <div class="content">
      <div class="row no-wrap">
        <AmountBox
          class="amount"
          :amount="value"
        />
        <div
          class="col"
        >
          <div
            v-t="'PICKUP_FEEDBACK.AMOUNT'"
            style="padding-bottom: .3em"
          />
          <AmountViewer
            v-if="!$q.platform.is.mobile"
            :amount="value"
          />
        </div>
        <QBtn
          v-if="!showOverlay"
          round
          flat
          @click="valueToNumber = null"
          color="red"
          class="self-start"
        >
          <QIcon name="fas fa-times" />
          <QTooltip v-t="'PICKUP_FEEDBACK.DELETE_AMOUNT'" />
        </QBtn>
      </div>
      <div class="row no-wrap">
        <QSlider
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
        <QInput
          style="width: 3em; margin: 0 5px 0 2em; text-align: right"
          v-model="valueToNumber"
          align="right"
        />
        <span style="padding: 3px">kg</span>
      </div>
    </div>
  </div>
</template>

<script>
import { QInput, QSlider, QBtn, QIcon, QTooltip } from 'quasar'
import AmountViewer from './AmountViewer'
import AmountBox from './AmountBox'

export default {
  props: { value: { default: null, type: Number } },
  components: { QInput, QSlider, QBtn, QIcon, QTooltip, AmountViewer, AmountBox },
  computed: {
    showOverlay () {
      return this.value === null
    },
    limitedValue: {
      get () {
        return Math.min(70, this.value)
      },
      set (v) {
        this.$emit('input', v)
      },
    },
    valueToNumber: {
      get () {
        return this.value
      },
      set (v) {
        let value = parseFloat(v, 10)
        value = isNaN(value) ? null : Math.max(0, value)
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style scoped lang="stylus">
.amount
  margin-right: 0.6em
.wrapper
  position relative
.showOverlay .content
  opacity 0.3
  filter blur(3px)
</style>
