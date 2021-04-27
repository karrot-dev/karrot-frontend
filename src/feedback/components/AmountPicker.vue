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
    <div class="content column no-wrap q-pl-lg q-pb-lg">
      <div class="row no-wrap items-center justify-between q-pt-xs">
        <div
          v-t="'ACTIVITY_FEEDBACK.AMOUNT'"
          class="col-9 text-bold q-py-md"
        />
        <QBtn
          v-if="!showOverlay"
          round
          flat
          color="red"
          class="self-center q-my-xs q-mr-sm"
          :title="$t('ACTIVITY_FEEDBACK.DELETE_AMOUNT')"
          @click="$emit('input', null)"
        >
          <QIcon name="fas fa-times" />
        </QBtn>
      </div>
      <div class="content-body row no-wrap items-center">
        <!-- don't use type="number" here because browsers might enforce different decimal setting
        depending on browser locale-->
        <QInput
          v-model="valueToNumber"
          class="q-pr-lg"
          outlined
          size="8"
        >
          <template #append>
            <span class="text-caption">kg</span>
          </template>
        </QInput>
        <div
          v-if="!$q.platform.is.mobile"
          class="col q-ml-md"
        >
          <AmountViewer :amount="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QInput,
  QBtn,
  QIcon,
} from 'quasar'

import AmountViewer from './AmountViewer'

export default {
  components: {
    QInput,
    QBtn,
    QIcon,
    AmountViewer,
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
}
</script>

<style scoped lang="stylus">
$border-radius = 13px

@import '~variables'

.wrapper
  position relative

.content
  background $grey-2
  border-radius 13px

  .content-body
    position relative
    height 60px

    &:after
      position absolute
      top 0
      right 0
      width 60px
      height 100%
      content ''
      background linear-gradient(90deg, transparent 0%, $grey-2 75%)

.showOverlay .content
  filter blur(3px)
  opacity 0.3
</style>
