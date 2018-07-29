<script>
import { connect } from 'vuex-connect'
import ApplicationList from '@/components/Applications/ApplicationList'

export default connect({
  actionsToEvents: {
    accept: 'groupApplications/accept',
  },

  gettersToProps: {
    groupApplications: 'groupApplications/all',
  },
})('ApplicationList', ApplicationList)
</script>
