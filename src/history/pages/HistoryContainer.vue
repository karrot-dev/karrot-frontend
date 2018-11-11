<script>
import { connect } from 'vuex-connect'
import HistoryList from '@/history/components/HistoryList'

export default connect({
  gettersToProps: {
    // we do not pass in the 'history' prop to keep this component versatile
    status: 'history/fetchStatus',
    canFetchPast: 'history/canFetchPast',
    fetchPastStatus: 'history/fetchPastStatus',
  },
  actionsToProps: {
    fetchPast: 'history/fetchPast',
  },
})('History', HistoryList)
</script>
