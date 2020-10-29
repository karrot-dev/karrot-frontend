<script>
import { connect } from 'vuex-connect'
import IssueListUI from '@/issues/components/IssueListUI'

export default connect({
  gettersToProps: {
    ongoingIssues: 'issues/ongoing',
    pastIssues: 'issues/past',
    status: 'issues/fetchByGroupIdStatus',
  },
  actionsToEvents: {
    'clear-detail': 'detail/clear',
  },
})('IssueList', IssueListUI)
</script>
