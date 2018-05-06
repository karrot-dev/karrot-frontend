<script>
import { connect } from 'vuex-connect'
import FeedbackList from '@/components/Statistics/FeedbackList'

export default connect({
  gettersToProps: {
    feedback: 'feedback/all',
    status: 'feedback/fetchStatus',
    hasMore: 'feedback/pagination/hasMore',
    feedbackPossible: 'pickups/feedbackPossible',
  },
  actionsToProps: {
    fetchMore: 'feedback/fetchMore',
  },
})('GroupFeedbackList', FeedbackList)
</script>
