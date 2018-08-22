<script>
import { connect } from 'vuex-connect'
import ApplicationList from '@/components/Applications/ApplicationList'

export default connect({
  gettersToProps: {
    pending: 'groupApplications/pending',
    otherApplications: 'groupApplications/allNonPending',
  },

  actionsToEvents: {
    accept: 'groupApplications/accept',
    decline: 'groupApplications/decline',
    openChat: 'detail/openForApplication',
  },
})('ApplicationList', ApplicationList)
</script>
