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

import FeedbackList from '@/feedback/components/FeedbackList'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'
import { useFeedbackListQuery } from '@/feedback/queries'
import { useFeedbackEnricher } from '@/feedback/enrichers'

const enrichFeedback = useFeedbackEnricher()
const { groupId } = useCurrentGroupService()
const { getGroupStatus } = useStatusService()
const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)

const {
  feedbackList: feedbackListRaw,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useFeedbackListQuery({ groupId })

const feedbackList = computed(() => feedbackListRaw.value.map(enrichFeedback))
</script>
