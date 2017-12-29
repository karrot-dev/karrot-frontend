<script>
import { connect } from 'vuex-connect'
import FeedbackList from '@/components/Statistics/FeedbackList'

export default connect({
  gettersToProps: {
    feedback: 'feedback/all',
  },
})('GroupFeedbackList', FeedbackList)
</script>
