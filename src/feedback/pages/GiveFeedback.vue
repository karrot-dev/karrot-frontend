<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import ActivityFeedback from '@/feedback/components/ActivityFeedback'

export default connect({
  gettersToProps: {
    activities: 'activities/feedbackPossibleByCurrentGroup',
    editFeedbackId: 'feedback/selectedId',
    editFeedback: 'feedback/selected',
    existingFeedback: 'feedback/byCurrentGroup',
    saveStatus: 'feedback/saveStatus',
    fetchStatus: 'feedback/fetchStatus',
    fetchFeedbackPossibleStatus: 'activities/fetchFeedbackPossibleStatus',
    seedId: 'currentGroup/id',
  },
  actionsToEvents: {
    save: 'feedback/save',
    dismissFeedback: 'activities/dismissFeedback',
  },
})('GiveFeedback', ActivityFeedback)
</script>
