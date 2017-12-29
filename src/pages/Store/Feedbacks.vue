<script>
import { connect } from 'vuex-connect'
import FeedbackList from '@/components/Statistics/FeedbackList'

export default connect({
  gettersToProps: {
    feedback: 'feedback/filtered',
  },
})('StoreFeedbackList', FeedbackList)
</script>
