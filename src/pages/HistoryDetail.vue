<script>
import { connect } from 'vuex-connect'
import HistoryDetail from '@/components/History/HistoryDetail'

export default connect({
  gettersToProps: {
    entry: 'history/active',
  },
  lifecycle: {
    mounted: ({ dispatch, getters }) => dispatch('history/setActive', getters['route/params'].historyId),
  },
})('HistoryDetail', HistoryDetail)
</script>
