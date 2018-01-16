<script>
import { connect } from 'vuex-connect'
import PickupFeedback from '@/components/Statistics/PickupFeedback'

export default connect({
  gettersToProps: {
    pickups: 'pickups/feedbackPossible',
    editFeedback: 'feedback/selected',
    existingFeedback: 'feedback/all',
    saveStatus: 'feedback/saveStatus',
    fetchStatus: 'feedback/fetchStatus',
  },
  actionsToEvents: {
    save: 'feedback/save',
  },
})('PickupFeedback', PickupFeedback)
</script>
