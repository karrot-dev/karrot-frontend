<template>
  <div :title="tooltipContent">
    {{ dateInWords }}
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

import dateFnsHelper from '@/utils/dateFnsHelper'

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
  future: {
    type: Boolean,
    default: undefined,
  },
  strict: {
    type: Boolean,
    default: false,
  },
  noSuffix: {
    type: Boolean,
    default: false,
  },
  days: {
    type: Boolean,
    default: false,
  },
})

const { d } = useI18n()

const tooltipContent = computed(() => d(new Date(props.date), 'long'))

const dateInWords = computed(() => dateFnsHelper.formatDistanceToNow(props.date, {
  addSuffix: !props.noSuffix,
  future: props.future,
  strict: props.strict,
  days: props.days,
}))
</script>
