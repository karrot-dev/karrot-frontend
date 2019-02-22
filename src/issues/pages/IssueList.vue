<script>
import { connect } from 'vuex-connect'
import IssueListUI from '@/issues/components/IssueListUI'

export default connect({
  gettersToProps: {
    ongoingIssues: 'issues/ongoing',
    pastIssues: 'issues/past',
  },
  methodsToEvents: {
    open: ({ dispatch }, issue) => {
      dispatch('detail/openForIssue', issue)
    },
  },
})('IssueList', IssueListUI)
</script>
