<template>
  <div>
    <QCard class="no-shadow no-padding grey-border">
      <div class="generic-padding relative-position">
        <div
          v-if="statistics"
          class="infoChips row no-wrap"
        >
          <QChip
            icon="fas fa-shopping-basket"
            color="secondary"
            square
            :title="$t('FEEDBACKLIST.NUMBER_PICKUPS', { count: statistics.pickupsDone })"
          >
            <strong>{{ statistics.pickupsDone }}</strong>
          </QChip>
          <QChip
            v-if="statistics.feedbackCount > 0"
            icon="fas fa-balance-scale"
            color="secondary"
            square
            :title="$t('FEEDBACKLIST.NUMBER_FEEDBACK', { count: statistics.feedbackCount })"
          >
            <strong>{{ statistics.feedbackCount }}</strong>
          </QChip>
          <QChip
            v-if="statistics.feedbackWeight > 0"
            icon="fas fa-weight"
            color="secondary"
            square
            :title="$t('FEEDBACKLIST.WEIGHT_SUM', { sum: statistics.feedbackWeight })"
          >
            <strong>{{ statistics.feedbackWeight }}&nbsp;kg</strong>
          </QChip>
        </div>
        <span v-if="statistics && statistics.feedbackWeight > 0">
          {{ $tc('FEEDBACKLIST.SAVED_FOOD', 2, { amount: statistics.feedbackWeight }) }}
        </span>
      </div>
    </QCard>
    <FeedbackList
      :feedback="feedback"
      :status="fetchStatus"
      :can-fetch-past="canFetchPast"
      :fetch-past="fetchPast"
      :fetch-past-status="fetchPastStatus"
      :feedback-possible="feedbackPossible"
    />
  </div>
</template>

<script>
import FeedbackList from '@/feedback/components/FeedbackList'
import { QCard, QChip } from 'quasar'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { FeedbackList, QCard, QChip },
  computed: {
    ...mapGetters({
      store: 'stores/currentStore',
      feedback: 'feedback/byCurrentStore',
      fetchStatus: 'feedback/fetchStatus',
      canFetchPast: 'feedback/canFetchPast',
      fetchPastStatus: 'feedback/fetchPastStatus',
      feedbackPossible: 'pickups/feedbackPossibleByCurrentStore',
    }),
    statistics () {
      return this.store && this.store.statistics
    },
  },
  methods: {
    ...mapActions({
      fetchPast: 'feedback/fetchPast',
    }),
  },
}
</script>

<style scoped lang="stylus">
.infoChips
  padding-bottom 15px
  .q-chip
    margin-right 8px
    padding 2px 16px
</style>
