<script>
import { connect } from 'vuex-connect'
import IssueListUI from '@/issues/components/IssueListUI'
import router from '@/base/router'

export default connect({
  gettersToProps: {
    ongoingIssues: 'issues/getOngoing',
    pastIssues: 'issues/getPast',
  },
  methodsToEvents: {
    open: (_, issue) => {
      router.push({ name: 'issueTabs', params: { issueId: issue.id } })
    },
  },
})('IssueList', IssueListUI)
</script>
