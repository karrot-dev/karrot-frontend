<template>
  <KNotice v-if="isEmpty">
    <template #icon>
      <QIcon :class="$icon('feedback')" />
    </template>
    {{ $t('FEEDBACKLIST.NONE') }}
    <template #desc>
      {{ $t('FEEDBACKLIST.NONE_HINT') }}
    </template>
  </KNotice>
  <template v-if="activities.length > 0">
    <slot name="header" />
    <QInfiniteScroll
      v-bind="infiniteScroll"
    >
      <ActivityFeedbackList
        :activities="activities"
        :highlight-feedback="highlightFeedback"
      />
      <template #loading>
        <KSpinner />
      </template>
    </QInfiniteScroll>
  </template>
</template>
<script setup>

import { QIcon, QInfiniteScroll } from 'quasar'
import { computed, toRefs } from 'vue'

import { useActivityListQuery } from '@/activities/queries'

import ActivityFeedbackList from '@/activities/components/ActivityFeedbackList.vue'
import KNotice from '@/utils/components/KNotice.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const isEmpty = computed(() => !isLoading.value && activities.value.length === 0)

const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
  highlightFeedback: {
    type: Number,
    default: null,
  },
})

const { placeId } = toRefs(props)

const {
  activities,
  isLoading,
  infiniteScroll,
} = useActivityListQuery({
  placeId,
  ordering: '-date',
  hasFeedback: true,
})
</script>
