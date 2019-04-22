<template>
  <div :title="tooltipContent">
    {{ dateInWords }}
  </div>
</template>

<script>
import dateFnsHelper from '@/utils/dateFnsHelper'

export default {
  props: {
    date: {
      type: [Date, String], // TODO remove string, always convert to date before
      required: true,
    },
    future: {
      type: Boolean,
      default: false,
    },
    strict: {
      type: Boolean,
      default: false,
    },
    noSuffix: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tooltipContent () {
      return this.$d(new Date(this.date), 'long')
    },
    dateInWords () {
      return dateFnsHelper.distanceInWordsToNow(this.date, {
        addSuffix: !this.noSuffix,
        future: this.future,
        strict: this.strict,
      })
    },
  },
}
</script>
