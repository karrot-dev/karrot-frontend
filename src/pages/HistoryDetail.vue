<script>
import { connect } from 'vuex-connect'
import HistoryDetail from '@/components/History/HistoryDetail'

export default connect({
  gettersToProps: {
    entry: 'history/active',
  },
})('HistoryDetail', HistoryDetail)
</script>
