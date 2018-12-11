<script>
import { connect } from 'vuex-connect'
import PickupFeedback from '@/feedback/components/PickupFeedback'

export default connect({
  gettersToProps: {
    pickups: 'pickups/feedbackPossibleByCurrentGroup',
    editFeedback: 'feedback/selected',
    existingFeedback: 'feedback/byCurrentGroup',
    saveStatus: 'feedback/saveStatus',
    fetchStatus: 'feedback/fetchStatus',
    seedId: 'currentGroup/id',
  },
  actionsToEvents: {
    save: 'feedback/save',
  },
})('GiveFeedback', PickupFeedback)
</script>
