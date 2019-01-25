<script>
import { connect } from 'vuex-connect'
import IssueTabsUI from '@/issues/components/IssueTabsUI'

export default connect({
  gettersToProps: {
    issue: 'issues/getCurrent',
  },
})('IssueTabs', IssueTabsUI)
</script>
