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
      @click="$emit('input', 0)"
    >
      {{ $t('ACTIVITY_FEEDBACK.SET_AMOUNT') }}
    </QBtn>
    <div class="content q-px-lg q-pt-lg q-pb-xs">
      <div class="row no-wrap q-mt-sm">
        <AmountBox
          class="amount"
          :amount="value"
        />
        <div
          style="margin-left: .6em"
          class="col"
        >
          <div
            v-t="'ACTIVITY_FEEDBACK.AMOUNT'"
            class="q-pb-sm"
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
          color="red"
          class="self-start"
          :title="$t('ACTIVITY_FEEDBACK.DELETE_AMOUNT')"
          @click="$emit('input', null)"
        >
          <QIcon name="fas fa-times" />
        </QBtn>
      </div>
      <div class="row no-wrap">
        <QSlider
          :value="limitedValue"
          :min="0"
          :max="SLIDER_LIMIT"
          :step="0.5"
          label
          class="self-center q-mr-lg q-ml-sm"
          @input="$emit('input', arguments[0])"
        />
        <!-- don't use type="number" here because browsers might enforce different decimal setting
        depending on browser locale-->
        <QInput
          v-model="valueToNumber"
          dense
          outlined
          size="8"
        >
          <template #append>
            <span class="text-caption">kg</span>
          </template>
        </QInput>
      </div>
    </div>
    <div
      class="content-more-weight-info text-center text-caption q-px-lg"
      :class="{'bg-info': isOnMaxOfSlider}"
    >
      <span v-if="isOnMaxOfSlider">{{ $t('ACTIVITY_FEEDBACK.INCREASE_AMOUNT_HINT') }}</span>
    </div>
  </div>
</template>

<script>
import {
  QInput,
  QSlider,
  QBtn,
  QIcon,
} from 'quasar'

import AmountViewer from './AmountViewer'
import AmountBox from './AmountBox'

export default {
  components: {
    QInput,
    QSlider,
    QBtn,
    QIcon,
    AmountViewer,
    AmountBox,
  },
  props: {
    value: {
      default: null,
      type: Number,
    },
  },
  computed: {
    showOverlay () {
      return this.value === null
    },
    limitedValue: {
      get () {
        return Math.min(this.SLIDER_LIMIT, this.value)
      },
      set (v) {
        this.$emit('input', v)
      },
    },
    isOnMaxOfSlider () {
      return this.value === this.SLIDER_LIMIT
    },
    valueToNumber: {
      get () {
        return this.value
      },
      set (v) {
        let value = parseFloat(v, 10)
        value = isNaN(value) ? 0 : Math.max(0, value)
        this.$emit('input', value)
      },
    },
  },
  created () { this.SLIDER_LIMIT = 100 },
}
</script>

<style scoped lang="stylus">
$border-radius = 13px
$info-box-height = 30px

@import '~variables'

.wrapper
  position relative

.content
  background $grey-2
  border-top-left-radius $border-radius
  border-top-right-radius $border-radius

.content-more-weight-info
  height $info-box-height
  line-height $info-box-height
  background $grey-2
  border-bottom-right-radius $border-radius
  border-bottom-left-radius $border-radius

.showOverlay .content,
.showOverlay .content-more-weight-info
  filter blur(3px)
  opacity 0.3
</style>
