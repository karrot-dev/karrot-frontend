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
  },
})('GiveFeedback', ActivityFeedback)
</script>
