<template>
  <q-card>
    <HistoryList :store="store" />
  </q-card>
</template>

<script>

import { mapGetters } from 'vuex'
import { QCard, QCardTitle } from 'quasar'
import HistoryList from '@/components/History/HistoryList'

export default {
  components: { QCard, QCardTitle, HistoryList },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
  },
}
</script>
