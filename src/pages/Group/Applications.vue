<script>
import { connect } from 'vuex-connect'
import ApplicationList from '@/components/Applications/ApplicationList'

export default connect({
  gettersToProps: {
    groupApplications: 'groupApplications/all',
  },

  actionsToEvents: {
    accept: 'groupApplications/accept',
    decline: 'groupApplications/decline',
  },
})('ApplicationList', ApplicationList)
</script>
