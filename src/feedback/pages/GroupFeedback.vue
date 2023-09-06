<template>
  <FeedbackNotice
    v-if="feedbackPossibleCount > 0"
    :feedback-possible-count="feedbackPossibleCount"
  />
  <KNotice v-if="isEmpty">
    <template #icon>
      <QIcon :class="$icon('feedback')" />
    </template>
    {{ $t('FEEDBACKLIST.NONE') }}
    <template #desc>
      {{ $t('FEEDBACKLIST.NONE_HINT') }}
    </template>
  </KNotice>
  <QInfiniteScroll
    v-bind="infiniteScroll"
  >
    <ActivityFeedbackList
      :activities="activities"
    />
    <template #loading>
      <KSpinner />
    </template>
  </QInfiniteScroll>
</template>

<script setup>
import { QIcon, QInfiniteScroll } from 'quasar'
import { computed } from 'vue'

import { useActivityListQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

import ActivityFeedbackList from '@/activities/components/ActivityFeedbackList.vue'
import FeedbackNotice from '@/group/components/FeedbackNotice.vue'
import KNotice from '@/utils/components/KNotice.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const { groupId } = useCurrentGroupService()

const { getGroupStatus } = useStatusService()
const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)

const isEmpty = computed(() => !isLoading.value && activities.value.length === 0)

const {
  activities,
  isLoading,
  infiniteScroll,
} = useActivityListQuery({
  groupId,
  ordering: '-date',
  hasFeedback: true,
})
</script>
