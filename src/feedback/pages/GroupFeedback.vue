<template>
  <FeedbackList
    :feedback="feedbackList"
    :is-loading="isLoading"
    :has-next-page="hasNextPage"
    :fetch-next-page="fetchNextPage"
    :is-fetching-next-page="isFetchingNextPage"
    :feedback-possible-count="feedbackPossibleCount"
  />
</template>

<script setup>
import { computed } from 'vue'

import { useFeedbackListQuery } from '@/feedback/queries'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

import FeedbackList from '@/feedback/components/FeedbackList.vue'

const { groupId } = useCurrentGroupService()
const { getGroupStatus } = useStatusService()
const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)

const {
  feedbackList,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useFeedbackListQuery({ groupId })
</script>
