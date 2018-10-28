<script>
import { connect } from 'vuex-connect'
import FeedbackList from '@/feedback/components/FeedbackList'

export default connect({
  gettersToProps: {
    feedback: 'feedback/all',
    status: 'feedback/fetchStatus',
    canFetchPast: 'feedback/canFetchPast',
    fetchPastStatus: 'feedback/fetchPastStatus',
    feedbackPossible: 'pickups/feedbackPossible',
  },
  actionsToProps: {
    fetchPast: 'feedback/fetchPast',
  },
})('GroupFeedbackList', FeedbackList)
</script>
