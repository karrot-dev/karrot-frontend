<script>
import { connect } from 'vuex-connect'
import ApplicationList from '@/components/Applications/ApplicationList'

export default connect({
  gettersToProps: {
    pendingApplications: 'groupApplications/allPending',
    otherApplications: 'groupApplications/allNonPending',
  },

  actionsToEvents: {
    accept: 'groupApplications/accept',
    decline: 'groupApplications/decline',
  },
})('ApplicationList', ApplicationList)
</script>
