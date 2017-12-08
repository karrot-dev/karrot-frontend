<script>
import { connect } from 'vuex-connect'
import HistoryList from '@/components/History/HistoryList'

export default connect({
  gettersToProps: {
    history: 'history/all',
    fetchStatus: 'history/fetchFilteredStatus',
    canLoadMore: 'history/canLoadMore',
  },
  actionsToProps: {
    fetchMore: 'history/fetchMore',
  },
})('History', HistoryList)
</script>
