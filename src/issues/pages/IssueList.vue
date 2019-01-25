<script>
import { connect } from 'vuex-connect'
import IssueListUI from '@/issues/components/IssueListUI'

export default connect({
  gettersToProps: {
    ongoingIssues: 'issues/getOngoing',
    pastIssues: 'issues/getPast',
  },

  actionsToEvents: {
    open: 'issues/openOne',
  },
})('IssueList', IssueListUI)
</script>
