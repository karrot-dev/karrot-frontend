<script>
import { connect } from 'vuex-connect'
import HistoryListUI from '@/components/History/HistoryListUI.vue'

export default connect({
  gettersToProps: {
    history: 'history/all',
    status: 'history/receiveStatus',
    canLoadMore: 'history/canLoadMore',
  },
  actionsToProps: {
    fetchMore: 'history/fetchMore',
  },
  lifecycle: {
    mounted ({ dispatch }) {
      if (this.user) dispatch('history/fetchForUser', this.user)
      else if (this.group) dispatch('history/fetchForGroup', this.group)
      else if (this.store) dispatch('history/fetchForStore', this.store)
    },
    destroyed: ({ dispatch }) => dispatch('history/clear'),
  },
})('HistoryList', HistoryListUI)
</script>
