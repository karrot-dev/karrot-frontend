<template>
  <QInfiniteScroll
    v-bind="infiniteScroll"
  >
    <ActivityList
      :activities="activities"
      place-link
      read-only
    />
    <KSpinner v-show="isLoading || isFetchingNextPage" />
  </QInfiniteScroll>
  <!--
  <FeedbackList
    :feedback="feedbackList"
    :is-loading="isLoading"
    :has-next-page="hasNextPage"
    :fetch-next-page="fetchNextPage"
    :is-fetching-next-page="isFetchingNextPage"
    :feedback-possible-count="feedbackPossibleCount"
  />
  -->
</template>

<script setup>
import { QInfiniteScroll } from 'quasar'
import { computed } from 'vue'

import { useActivityListQuery } from '@/activities/queries'
import { useFeedbackListQuery } from '@/feedback/queries'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

import ActivityList from '@/activities/components/ActivityList.vue'
import FeedbackList from '@/feedback/components/FeedbackList.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const { groupId } = useCurrentGroupService()
const { getGroupStatus } = useStatusService()
const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)

const {
  activities,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  infiniteScroll,
} = useActivityListQuery({
  groupId,
  ordering: '-date',
  hasFeedback: true,
})

// const {
//   feedbackList,
//   isLoading,
//   hasNextPage,
//   fetchNextPage,
//   isFetchingNextPage,
// } = useFeedbackListQuery({ groupId })
</script>
