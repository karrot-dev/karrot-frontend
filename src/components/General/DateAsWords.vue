<template>
  <div>
    {{dateInWords(date)}}
    <q-tooltip>{{ $d(new Date(date), 'long') }}</q-tooltip>
  </div>
</template>

<script>
import { QTooltip } from 'quasar'

import dateFnsHelper from '@/services/DateFnsHelper'

export default {
  props: {
    date: { required: true },
  },
  components: { QTooltip },
  methods: {
    dateInWords (date) {
      return dateFnsHelper.distanceInWordsToNow(date)
    },
  },
}
</script>
