<template>
  <QInfiniteScroll
    v-bind="infiniteScroll"
  >
    <ActivityFeedbackList
      :activities="activities"
    />
    <KSpinner v-show="isLoading || isFetchingNextPage" />
  </QInfiniteScroll>
</template>

<script setup>
import { QInfiniteScroll } from 'quasar'

import { useActivityListQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'

import ActivityFeedbackList from '@/activities/components/ActivityFeedbackList.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const { groupId } = useCurrentGroupService()

const {
  activities,
  isLoading,
  isFetchingNextPage,
  infiniteScroll,
} = useActivityListQuery({
  groupId,
  ordering: '-date',
  hasFeedback: true,
})
</script>
