<template>
  <div>
    <q-card
      class="no-mobile-margin no-padding no-shadow grey-border"
    >
      <div class="group-banner">
        <RandomArt
          :seed="group.id"
          type="circles" />
      </div>
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
.group-banner > span
    display: block
    height 5vw
    min-height 30px
    max-height 48px
    overflow hidden

body.mobile .group-banner
  border 0
  max-height: 30px
  overflow: hidden
</style>
