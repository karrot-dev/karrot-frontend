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
      :feedback="feedbackList"
      :is-loading="isLoading"
      :has-next-page="hasNextPage"
      :fetch-next-page="fetchNextPage"
      :is-fetching-next-page="isFetchingNextPage"
      :highlight="highlight"
    />
  </div>
</template>

<script setup>
import {
  QCard,
  QChip,
} from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useFeedbackListQuery } from '@/feedback/queries'
import { usePlaceStatisticsQuery } from '@/places/queries'
import { useActivePlaceService } from '@/places/services'

import FeedbackList from '@/feedback/components/FeedbackList'
import KSpinner from '@/utils/components/KSpinner'

const route = useRoute()
const {
  placeId,
} = useActivePlaceService()
const { statistics } = usePlaceStatisticsQuery({ placeId })

const {
  feedbackList,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useFeedbackListQuery({ placeId })

const highlight = computed(() => route.query.highlight && parseInt(route.query.highlight, 10))
</script>

<style scoped lang="sass">
.infoChips
  padding-bottom: 15px

  .q-chip
    padding: 2px 16px
    margin-right: 8px
</style>
