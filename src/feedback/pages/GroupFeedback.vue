<script>
import { connect } from 'vuex-connect'
import FeedbackList from '@/feedback/components/FeedbackList'

export default connect({
  gettersToProps: {
    feedback: 'feedback/byCurrentGroup',
    status: 'feedback/fetchStatus',
    canFetchPast: 'feedback/canFetchPast',
    fetchPastStatus: 'feedback/fetchPastStatus',
    feedbackPossible: 'pickups/feedbackPossibleByCurrentGroup',
  },
  actionsToProps: {
    fetchPast: 'feedback/fetchPast',
  },
})('GroupFeedback', FeedbackList)
</script>
