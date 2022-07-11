<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
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
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import FeedbackList from '@/feedback/components/FeedbackList'

export default {
  components: {
    FeedbackList,
  },
}
</script>
