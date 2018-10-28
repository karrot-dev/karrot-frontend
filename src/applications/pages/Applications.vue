<script>
import { connect } from 'vuex-connect'
import ApplicationList from '@/applications/components/ApplicationList'

export default connect({
  gettersToProps: {
    pending: 'groupApplications/forCurrentGroupPending',
    otherApplications: 'groupApplications/forCurrentGroupNonPending',
  },

  actionsToEvents: {
    accept: 'groupApplications/accept',
    decline: 'groupApplications/decline',
    openChat: 'detail/openForApplication',
  },
})('ApplicationList', ApplicationList)
</script>
