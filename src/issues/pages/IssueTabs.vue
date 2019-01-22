<script>
import { connect } from 'vuex-connect'
import IssueTabs from '@/issues/components/IssueTabs'

export default connect({
  gettersToProps: {
    issue: 'issues/get',
  },
})('IssueTabs', IssueTabs)
</script>
