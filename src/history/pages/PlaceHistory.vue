<template>
  <div>
    <QCard
      class="no-padding no-shadow grey-border"
    >
      <div>
        <HistoryContainer
          class="padding-top"
          :history="history"
        />
      </div>
    </QCard>
  </div>
</template>

<script>
import { QCard } from 'quasar'
import HistoryContainer from '@/history/pages/HistoryContainer'
import { mapGetters } from 'vuex'

export default {
  components: {
    HistoryContainer,
    QCard,
  },
  computed: {
    ...mapGetters({
      history: 'history/byActivePlace',
    }),
  },
}
</script>

<style scoped lang="stylus">
.padding-top
  padding-top 15px
</style>
