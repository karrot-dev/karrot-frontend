<script>
import { connect } from 'vuex-connect'
import IssueTabsUI from '@/issues/components/IssueTabsUI'

export default connect({
  gettersToProps: {
    issue: 'issues/getCurrent',
  },
  actionsToEvents: {
    saveVote: 'issues/saveVotings',
  },
})('IssueTabs', IssueTabsUI)
</script>
