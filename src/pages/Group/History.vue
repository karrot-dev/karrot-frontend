<template>
  <q-card>
    <HistoryList :group="group" striped="even" />
  </q-card>
</template>

<script>
import { QCard, QCardTitle } from 'quasar'
import HistoryList from '@/components/History/HistoryList'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { QCard, QCardTitle, HistoryList },
  computed: {
    ...mapGetters({
      group: 'currentGroup/get',
    }),
  },
}
</script>
