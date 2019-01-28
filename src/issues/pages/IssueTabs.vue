<script>
import { connect } from 'vuex-connect'
import IssueTabsUI from '@/issues/components/IssueTabsUI'

export default connect({
  gettersToProps: {
    issue: 'issues/getCurrent',
  },
  actionsToEvents: {
    saveScores: 'issues/saveScores',
  },
})('IssueTabs', IssueTabsUI)
</script>
