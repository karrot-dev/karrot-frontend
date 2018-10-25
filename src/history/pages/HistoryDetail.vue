<script>
import { connect } from 'vuex-connect'
import HistoryDetail from '@/history/components/HistoryDetail'
export default connect({
  gettersToProps: {
    entry: 'history/active',
  },
})('HistoryDetail', HistoryDetail)
</script>
