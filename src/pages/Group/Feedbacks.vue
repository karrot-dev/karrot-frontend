<script>
import { connect } from 'vuex-connect'
import FeedbackList from '@/components/Statistics/FeedbackList'

export default connect({
  gettersToProps: {
    feedback: 'feedback/all',
    status: 'feedback/fetchStatus',
    canFetchPast: 'feedback/canFetchPast',
    feedbackPossible: 'pickups/feedbackPossible',
  },
  actionsToProps: {
    fetchPast: 'feedback/fetchPast',
  },
})('GroupFeedbackList', FeedbackList)
</script>
