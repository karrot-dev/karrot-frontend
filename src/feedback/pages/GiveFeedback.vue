<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <ActivityFeedback
    :activities="$store.getters['activities/feedbackPossibleByCurrentGroup']"
    :edit-feedback-id="$store.getters['feedback/selectedId']"
    :edit-feedback="$store.getters['feedback/selected']"
    :existing-feedback="$store.getters['feedback/byCurrentGroup']"
    :save-status="$store.getters['feedback/saveStatus']"
    :fetch-status="$store.getters['feedback/fetchStatus']"
    :fetch-feedback-possible-status="$store.getters['activities/fetchFeedbackPossibleStatus']"
    :seed-id="$store.getters['currentGroup/id']"
    @save="data => $store.dispatch('feedback/save', data)"
    @dismiss-feedback="data => $store.dispatch('activities/dismissFeedback', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import ActivityFeedback from '@/feedback/components/ActivityFeedback'

export default {
  components: {
    ActivityFeedback,
  },
}
</script>
