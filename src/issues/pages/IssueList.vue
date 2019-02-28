<script>
import { connect } from 'vuex-connect'
import IssueListUI from '@/issues/components/IssueListUI'

export default connect({
  gettersToProps: {
    ongoingIssues: 'issues/ongoing',
    pastIssues: 'issues/past',
    status: 'issues/fetchByGroupIdStatus',
  },
})('IssueList', IssueListUI)
</script>
