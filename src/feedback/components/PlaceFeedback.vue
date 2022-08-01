<template>
  <div>
    <QCard class="no-shadow grey-border">
      <div class="generic-padding relative-position">
        <KSpinner v-show="!statistics" />
        <div
          v-if="statistics"
          class="infoChips row no-wrap"
        >
          <QChip
            :icon="$icon('activity')"
            color="secondary"
            text-color="white"
            square
            :title="$t('FEEDBACKLIST.NUMBER_ACTIVITIES', { count: statistics.activitiesDone })"
          >
            <strong class="q-ml-sm">{{ statistics.activitiesDone }}</strong>
          </QChip>
          <QChip
            v-if="statistics.feedbackCount > 0"
            :icon="$icon('feedback')"
            color="secondary"
            text-color="white"
            square
            :title="$t('FEEDBACKLIST.NUMBER_FEEDBACK', { count: statistics.feedbackCount })"
          >
            <strong class="q-ml-sm">{{ statistics.feedbackCount }}</strong>
          </QChip>
          <QChip
            v-if="statistics.feedbackWeight > 0"
            icon="fas fa-weight"
            color="secondary"
            text-color="white"
            square
            :title="$t('FEEDBACKLIST.WEIGHT_SUM', { sum: statistics.feedbackWeight })"
          >
            <strong class="q-ml-sm">{{ statistics.feedbackWeight }}&nbsp;kg</strong>
          </QChip>
        </div>
        <span v-if="statistics && statistics.feedbackWeight > 0">
          {{ $tc('FEEDBACKLIST.SAVED_FOOD', 2, { amount: statistics.feedbackWeight }) }}
        </span>
      </div>
    </QCard>
    <!-- TODO: I removed feedbackPossibleCount as we only have it in the status object per group, not per place -->
    <FeedbackList
      :feedback="feedback"
      :status="fetchStatus"
      :can-fetch-past="canFetchPast"
      :fetch-past="fetchPast"
      :fetch-past-status="fetchPastStatus"
      :highlight="highlight"
    />
  </div>
</template>

<script>
import { computed } from 'vue'

import FeedbackList from '@/feedback/components/FeedbackList'
import KSpinner from '@/utils/components/KSpinner'

import {
  QCard,
  QChip,
} from 'quasar'

import {
  mapGetters,
  mapActions,
} from 'vuex'
import { useActivePlaceService } from '@/places/services'
import { usePlaceStatisticsQuery } from '@/places/queries'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

export default {
  components: {
    FeedbackList,
    KSpinner,
    QCard,
    QChip,
  },
  setup () {
    const { groupId } = useCurrentGroupService()
    const {
      placeId,
      place,
    } = useActivePlaceService()
    const { statistics } = usePlaceStatisticsQuery({ placeId })
    const { getGroupStatus } = useStatusService()
    const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)
    return {
      place,
      statistics,
      feedbackPossibleCount,
    }
  },
  computed: {
    ...mapGetters({
      feedback: 'feedback/byActivePlace',
      fetchStatus: 'feedback/fetchStatus',
      canFetchPast: 'feedback/canFetchPast',
      fetchPastStatus: 'feedback/fetchPastStatus',
      // feedbackPossible: 'activities/feedbackPossibleByActivePlace',
      // feedbackPossibleStatus: 'activities/fetchFeedbackPossibleStatus',
      routeQuery: 'route/query',
    }),
    highlight () {
      return parseInt(this.routeQuery.highlight)
    },
  },
  methods: {
    ...mapActions({
      fetchPast: 'feedback/fetchPast',
    }),
  },
}
</script>

<style scoped lang="sass">
.infoChips
  padding-bottom: 15px

  .q-chip
    padding: 2px 16px
    margin-right: 8px
</style>
