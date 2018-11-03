<script>
import { connect } from 'vuex-connect'
import HistoryListUI from '@/history/components/HistoryListUI'

export default connect({
  gettersToProps: {
    history: 'history/byCurrentGroupAndUser',
    status: 'history/fetchStatus',
    canFetchPast: 'history/canFetchPast',
    fetchPastStatus: 'history/fetchPastStatus',
  },
  actionsToProps: {
    fetchPast: 'history/fetchPast',
  },
})('UserHistory', HistoryListUI)
</script>
