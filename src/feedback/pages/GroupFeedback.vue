<template>
  <FeedbackList
    :feedback="feedbackList"
    :pending="isLoading"
    :can-fetch-past="hasNextPage"
    :fetch-past-status="$store.getters['feedback/fetchPastStatus']"
    :fetch-past="() => fetchNextPage()"
    :feedback-possible-count="feedbackPossibleCount"
  />
</template>

<script setup>
import { computed } from 'vue'

import { useFeedbackListQuery } from '@/feedback/queries'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

import FeedbackList from '@/feedback/components/FeedbackList'

const { groupId } = useCurrentGroupService()
const { getGroupStatus } = useStatusService()
const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)

const {
  feedbackList,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useFeedbackListQuery({ groupId })
</script>
