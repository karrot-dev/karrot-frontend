<script>
import { connect } from 'vuex-connect'
import HistoryListUI from '@/components/History/HistoryListUI'

export default connect({
  gettersToProps: {
    history: 'history/all',
    status: 'history/fetchFilteredStatus',
    canLoadMore: 'history/canLoadMore',
  },
  actionsToProps: {
    fetchMore: 'history/fetchMore',
  },
})('History', HistoryListUI)
</script>
