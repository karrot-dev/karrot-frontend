<script>
import { connect } from 'vuex-connect'
import PickupFeedback from '@/feedback/components/PickupFeedback'

export default connect({
  gettersToProps: {
    pickups: 'pickups/feedbackPossibleByCurrentGroup',
    editFeedbackId: 'feedback/selectedId',
    editFeedback: 'feedback/selected',
    existingFeedback: 'feedback/byCurrentGroup',
    saveStatus: 'feedback/saveStatus',
    fetchStatus: 'feedback/fetchStatus',
    fetchFeedbackPossibleStatus: 'pickups/fetchFeedbackPossibleStatus',
    seedId: 'currentGroup/id',
  },
  actionsToEvents: {
    save: 'feedback/save',
  },
})('GiveFeedback', PickupFeedback)
</script>
