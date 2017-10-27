<template>
  <q-card>
    <HistoryList :store="store" striped="even" />
  </q-card>
</template>

<script>

import { mapGetters } from 'vuex'
import { QCard, QCardTitle } from 'quasar'
import HistoryList from '@/components/History/HistoryList.vue'

export default {
  components: { QCard, QCardTitle, HistoryList },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
  },
}
</script>
