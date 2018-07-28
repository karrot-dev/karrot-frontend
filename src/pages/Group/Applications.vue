<script>
import { connect } from 'vuex-connect'
import ApplicationList from '@/components/Applications/ApplicationList'

export default connect({
  gettersToProps: {
    groupApplications: 'groupApplications/all',
  },
})('ApplicationList', ApplicationList)
</script>
