<template>
  <div>
    <QCard
      flat
    >
      <QCardSection>
        <KSpinner v-show="!statistics" />
        <div
          v-if="statistics"
          class="row no-wrap q-gutter-sm"
        >
          <QChip
            :icon="$icon('activity')"
            color="secondary"
            text-color="white"
            square
            :title="$t('FEEDBACKLIST.NUMBER_ACTIVITIES', { count: statistics.activitiesDone })"
          >
            <strong class="q-ml-sm">
              {{ statistics.activitiesDone }}
            </strong>
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
        <div
          v-if="statistics && statistics.feedbackWeight > 0"
          class="q-mt-sm"
        >
          {{ $tc('FEEDBACKLIST.SAVED_FOOD', 2, { amount: statistics.feedbackWeight }) }}
        </div>
      </QCardSection>
    </QCard>
    <PlaceFeedbackList
      :place-id="placeId"
      :highlight-feedback="highlightFeedback"
    />
  </div>
</template>

<script setup>
import {
  QCard,
  QCardSection,
  QChip,
} from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { usePlaceStatisticsQuery } from '@/places/queries'
import { useActivePlaceService } from '@/places/services'

import PlaceFeedbackList from '@/feedback/components/PlaceFeedbackList.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const route = useRoute()
const {
  placeId,
} = useActivePlaceService()
const { statistics } = usePlaceStatisticsQuery({ placeId })

const highlightFeedback = computed(() => route.query.highlight && parseInt(route.query.highlight, 10))
</script>
