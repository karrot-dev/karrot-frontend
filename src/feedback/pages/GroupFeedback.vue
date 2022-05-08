<template>
  <FeedbackList
    :feedback="$store.getters['feedback/byCurrentGroup']"
    :status="$store.getters['feedback/fetchStatus']"
    :can-fetch-past="$store.getters['feedback/canFetchPast']"
    :fetch-past-status="$store.getters['feedback/fetchPastStatus']"
    :feedback-possible="$store.getters['activities/feedbackPossibleByCurrentGroup']"
    :fetch-past="() => $store.dispatch('feedback/fetchPast')"
  />
</template>

<script>
import FeedbackList from '@/feedback/components/FeedbackList'

export default {
  components: {
    FeedbackList,
  },
}
</script>
