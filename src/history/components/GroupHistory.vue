<script>
import { connect } from 'vuex-connect'
import HistoryListUI from '@/history/components/HistoryListUI'

export default connect({
  gettersToProps: {
    history: 'history/byCurrentGroup',
    status: 'history/fetchStatus',
    canFetchPast: 'history/canFetchPast',
    fetchPastStatus: 'history/fetchPastStatus',
  },
  actionsToProps: {
    fetchPast: 'history/fetchPast',
  },
})('GroupHistory', HistoryListUI)
</script>
