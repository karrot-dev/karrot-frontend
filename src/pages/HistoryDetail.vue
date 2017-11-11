<script>
import { connect } from '@/connect'
import HistoryDetail from '@/components/History/HistoryDetail'

const loadHistory = ({ dispatch, getters }) => dispatch('history/setActive', getters['route/params'].historyId)

export default connect({
  gettersToProps: {
    entry: 'history/active',
  },
  lifecycle: {
    beforeRouteEnter: loadHistory,
    beforeRouteUpdate: loadHistory,
  },
})('HistoryDetail', HistoryDetail)
</script>
