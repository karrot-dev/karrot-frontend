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
      @click="$emit('update:modelValue', 0)"
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
          @click="$emit('update:modelValue', null)"
        >
          <QIcon name="fas fa-times" />
        </QBtn>
      </div>
      <div class="content-body row no-wrap items-center">
        <QInput
          v-model="valueToNumber"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.1"
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
          <AmountViewer :amount="modelValue" />
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
    modelValue: {
      default: null,
      type: Number,
    },
  },
  emits: [
    'update:modelValue',
  ],
  computed: {
    showOverlay () {
      return this.modelValue === null
    },
    valueToNumber: {
      get () {
        return this.modelValue
      },
      set (v) {
        let value = parseFloat(v, 10)
        value = isNaN(value) ? 0 : Math.max(0, value)
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>

<style scoped lang="sass">
.wrapper
  position: relative

.content
  background: $grey-2
  border-radius: 13px

  .content-body
    position: relative
    height: 60px

    &:after
      position: absolute
      top: 0
      right: 0
      width: 60px
      height: 100%
      content: ''
      background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, $grey-2 75%)

.showOverlay .content
  filter: blur(3px)
  opacity: 0.3
</style>
