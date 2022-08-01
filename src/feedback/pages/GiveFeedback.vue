<template>
  <ActivityFeedback
    :activities="enrichedActivities"
    :edit-feedback-id="$store.getters['feedback/selectedId']"
    :edit-feedback="$store.getters['feedback/selected']"
    :existing-feedback="$store.getters['feedback/byCurrentGroup']"
    :save-status="$store.getters['feedback/saveStatus']"
    :fetch-status="$store.getters['feedback/fetchStatus']"
    :fetch-feedback-possible-status="$store.getters['activities/fetchFeedbackPossibleStatus']"
    :seed-id="$store.getters['currentGroup/id']"
    @save="data => $store.dispatch('feedback/save', data)"
    @dismiss-feedback="data => $store.dispatch('activities/dismissFeedback', data)"
  />
</template>

<script setup>
import { computed } from 'vue'

import ActivityFeedback from '@/feedback/components/ActivityFeedback'
import { useActivityListQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { useActivityEnricher } from '@/activities/enrichers'
import { useIntegerRouteParam } from '@/utils/composables'
import { useFeedbackListQuery } from '@/feedback/queries'

const { groupId } = useCurrentGroupService()

const activityId = useIntegerRouteParam('activityId')

const { activities } = useActivityListQuery({
  groupId,
  feedbackPossible: true,
})

const enrichActivity = useActivityEnricher()
const enrichedActivities = computed(() => activities.value.map(enrichActivity))

const placeId = computed(() => activities.value.find(activity => activity.id === activityId.value)?.place)

const { feedback } = useFeedbackListQuery({ placeId })
</script>
