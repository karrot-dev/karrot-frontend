<template>
  <div>
    <QCard
      class="no-mobile-margin no-shadow grey-border"
    >
      <RandomArt
        v-if="$q.platform.is.desktop"
        :seed="group.id"
        type="circles"
      />
      <HistoryContainer
        class="padding-top"
        :history="history"
      />
    </QCard>
  </div>
</template>

<script>
import { QCard, QBtn, QTooltip } from 'quasar'
import HistoryContainer from '@/history/pages/HistoryContainer'
import RandomArt from '@/utils/components/RandomArt'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { RandomArt, HistoryContainer, QCard, QBtn, QTooltip },
  computed: {
    ...mapGetters({
      group: 'currentGroup/value',
      history: 'history/byCurrentGroup',
    }),
  },
}
</script>

<style scoped lang="stylus">
body.mobile .art-overlay
  width 100%
  height 30px
  background linear-gradient(to bottom, rgba(0,0,0,0.34) 0%,rgba(0,0,0,0) 100%)
.padding-top
  padding-top 10px
</style>
