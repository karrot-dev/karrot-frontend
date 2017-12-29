<script>
import { connect } from 'vuex-connect'
import PickupFeedback from '@/components/Statistics/PickupFeedback'

export default connect({
  gettersToProps: {
    feedbackPossible: 'pickups/feedbackPossible',
    feedbackList: 'feedback/all',
    status: 'feedback/saveStatus',
  },
  actionsToEvents: {
    save: 'feedback/save',
  },
})('PickupFeedback', PickupFeedback)
</script>
