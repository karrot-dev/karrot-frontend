<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import HistoryDetail from '@/history/components/HistoryDetail'
export default connect({
  gettersToProps: {
    entry: 'history/active',
  },
})('HistoryDetail', HistoryDetail)
</script>
