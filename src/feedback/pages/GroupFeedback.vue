<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import FeedbackList from '@/feedback/components/FeedbackList'

export default connect({
  gettersToProps: {
    feedback: 'feedback/byCurrentGroup',
    status: 'feedback/fetchStatus',
    canFetchPast: 'feedback/canFetchPast',
    fetchPastStatus: 'feedback/fetchPastStatus',
    feedbackPossible: 'activities/feedbackPossibleByCurrentGroup',
  },
  actionsToProps: {
    'fetch-past': 'feedback/fetchPast',
  },
})('GroupFeedback', FeedbackList)
</script>
