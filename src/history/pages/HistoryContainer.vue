<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


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
    'fetch-past': 'history/fetchPast',
  },
})('History', HistoryList)
</script>
