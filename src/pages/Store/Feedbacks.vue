<template>
  <div>
    <q-card class="no-shadow no-padding grey-border">
      <div class="generic-padding relative-position">
        <div class="actionButtons">
          <router-link
            v-if="feedbackPossibleFiltered.length > 0"
            :to="{name: 'pickupFeedback'}"
          >
            <q-btn
              small
              round
              color="secondary"
              icon="fas fa-plus"
              class="hoverScale"
            >
              <q-tooltip v-t="'FEEDBACKLIST.GIVE_FEEDBACK'" />
            </q-btn>
          </router-link>
        </div>
        <div
          v-if="statistics"
          class="infoChips row no-wrap"
        >
          <q-chip
            icon="fas fa-shopping-basket"
            color="secondary"
            square
            :title="$t('FEEDBACKLIST.NUMBER_PICKUPS', { count: statistics.pickupsDone })"
          >
            <strong>{{ statistics.pickupsDone }}</strong>
          </q-chip>
          <q-chip
            v-if="statistics.feedbackCount > 0"
            icon="fas fa-balance-scale"
            color="secondary"
            square
            :title="$t('FEEDBACKLIST.NUMBER_FEEDBACK', { count: statistics.feedbackCount })"
          >
            <strong>{{ statistics.feedbackCount }}</strong>
          </q-chip>
          <q-chip
            v-if="statistics.feedbackWeight > 0"
            icon="fas fa-weight"
            color="secondary"
            square
            :title="$t('FEEDBACKLIST.WEIGHT_SUM', { sum: statistics.feedbackWeight })"
          >
            <strong>{{ statistics.feedbackWeight }}&nbsp;kg</strong>
          </q-chip>
        </div>
        <span v-if="statistics && statistics.feedbackWeight > 0">
          {{ $tc('FEEDBACKLIST.SAVED_FOOD', 2, { amount: statistics.feedbackWeight }) }}
        </span>
      </div>
    </q-card>
    <FeedbackList
      :feedback="feedback"
      :status="fetchStatus"
      :can-fetch-past="canFetchPast"
      :fetch-past="fetchPast"
    />
  </div>
</template>

<script>
import FeedbackList from '@/components/Statistics/FeedbackList'
import { QCard, QTooltip, QBtn, QChip } from 'quasar'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { FeedbackList, QCard, QTooltip, QBtn, QChip },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
      feedback: 'feedback/all',
      fetchStatus: 'feedback/fetchStatus',
      canFetchPast: 'feedback/canFetchPast',
      feedbackPossibleFiltered: 'pickups/feedbackPossibleFiltered',
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
.q-btn-round
  margin-bottom .5em
.actionButtons
  margin-top -36px
  float right
  .q-btn
    margin 3px
.infoChips
  padding-bottom 15px
  .q-chip
    margin-right 8px
    padding 2px 16px
</style>
