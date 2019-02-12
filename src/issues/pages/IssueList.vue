<script>
import { connect } from 'vuex-connect'
import IssueListUI from '@/issues/components/IssueListUI'
import router from '@/base/router'

export default connect({
  gettersToProps: {
    ongoingIssues: 'issues/ongoing',
    pastIssues: 'issues/past',
  },
  methodsToEvents: {
    open: (_, issue) => {
      router.push({ name: 'issue', params: { issueId: issue.id } })
    },
  },
})('IssueList', IssueListUI)
</script>
