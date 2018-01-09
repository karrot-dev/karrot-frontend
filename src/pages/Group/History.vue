<template>
  <div>
    <q-card
      class="no-mobile-margin no-padding no-shadow grey-border"
    >
      <RandomArt
        v-if="$q.platform.is.desktop"
        :seed="group.id"
        type="circles" />
      <div class="generic-padding">
        <HistoryList/>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QBtn, QTooltip } from 'quasar'
import HistoryList from '@/components/History/HistoryList'
import RandomArt from '@/components/General/RandomArt'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { RandomArt, HistoryList, QCard, QBtn, QTooltip },
  computed: {
    ...mapGetters({
      group: 'currentGroup/value',
    }),
  },
}
</script>

<style scoped lang="stylus">
body.mobile .art-overlay
  width 100%
  height 30px
  background linear-gradient(to bottom, rgba(0,0,0,0.34) 0%,rgba(0,0,0,0) 100%)
</style>
