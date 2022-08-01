<template>
  <FeedbackList
    :feedback="$store.getters['feedback/byCurrentGroup']"
    :status="$store.getters['feedback/fetchStatus']"
    :can-fetch-past="$store.getters['feedback/canFetchPast']"
    :fetch-past-status="$store.getters['feedback/fetchPastStatus']"
    :feedback-possible-count="feedbackPossibleCount"
    :fetch-past="() => $store.dispatch('feedback/fetchPast')"
  />
</template>

<script setup>
import { computed } from 'vue'

import FeedbackList from '@/feedback/components/FeedbackList'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

const { groupId } = useCurrentGroupService()
const { getGroupStatus } = useStatusService()
const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)
</script>
