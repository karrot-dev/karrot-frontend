<script>
import { connect } from 'vuex-connect'
import ApplicationList from '@/applications/components/ApplicationList'

export default connect({
  gettersToProps: {
    pending: 'applications/forCurrentGroupPending',
    otherApplications: 'applications/forCurrentGroupNonPending',
    canFetchPast: 'applications/canFetchPast',
    fetchPastStatus: 'applications/fetchPastStatus',
  },
  actionsToProps: {
    fetchPast: 'applications/fetchPast',
  },
  actionsToEvents: {
    accept: 'applications/accept',
    decline: 'applications/decline',
    openChat: 'detail/openForApplication',
  },
})('ApplicationList', ApplicationList)
</script>
