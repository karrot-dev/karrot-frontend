<script>
import { connect } from 'vuex-connect'
import PickupFeedback from '@/feedback/components/PickupFeedback'

export default connect({
  gettersToProps: {
    pickups: 'pickups/feedbackPossible',
    editFeedback: 'feedback/selected',
    existingFeedback: 'feedback/all',
    saveStatus: 'feedback/saveStatus',
    fetchStatus: 'feedback/fetchStatus',
    seedId: 'currentGroup/id',
  },
  actionsToEvents: {
    save: 'feedback/save',
  },
})('PickupFeedback', PickupFeedback)
</script>
