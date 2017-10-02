<script>
import { connect } from 'vuex-connect'
import HistoryList from '@/components/HistoryList.vue'

export default connect({
  gettersToProps: {
    history: 'history/all',
    status: 'history/receiveStatus',
    canLoadMore: 'history/canLoadMore',
  },
  actionsToEvents: {
    more: 'history/fetchMore',
  },
  lifecycle: {
    mounted: ({ dispatch }) => dispatch('history/fetchForActiveUser'),
    destroyed: ({ dispatch }) => dispatch('history/clear'),
  },
})('UserHistory', HistoryList)
</script>
