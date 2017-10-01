<script>
import { connect } from 'vuex-connect'
import HistoryUI from '@/components/HistoryUI.vue'

export default connect({
  gettersToProps: {
    entries: 'history/all',
    status: 'history/receiveStatus',
    canLoadMore: 'history/canLoadMore',
  },
  actionsToEvents: {
    more: 'history/fetchMore',
  },
  lifecycle: {
    mounted: ({ dispatch }) => dispatch('history/fetchForActiveGroup'),
    destroyed: ({ dispatch }) => dispatch('history/clear'),
  },
})('GroupHistory', HistoryUI)
</script>
