<template>
  <div>
    <q-card
      class="no-padding no-shadow grey-border"
    >
      <div class="generic-padding">
        <HistoryList/>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QBtn, QTooltip } from 'quasar'
import HistoryList from '@/components/History/HistoryList'

export default {
  components: { HistoryList, QCard, QBtn, QTooltip },
}
</script>

<style scoped lang="stylus">
</style>
