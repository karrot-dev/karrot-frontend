<template>
  <div>
    <q-card
      class="no-padding no-shadow grey-border"
    >
      <div>
        <HistoryContainer
          class="padding-top"
          :history="history"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QBtn, QTooltip } from 'quasar'
import HistoryContainer from '@/history/pages/HistoryContainer'
import { mapGetters } from 'vuex'

export default {
  components: { HistoryContainer, QCard, QBtn, QTooltip },
  computed: {
    ...mapGetters({
      history: 'history/byActiveStore',
    }),
  },
}
</script>

<style scoped lang="stylus">
.padding-top
  padding-top 15px
</style>
