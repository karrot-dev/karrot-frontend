<script>
import { connect } from 'vuex-connect'
import GroupSettings from '@/components/Group/GroupSettings'

export default connect({
  gettersToProps: {
    group: 'currentGroup/value',
  },
  actionsToEvents: {
    changeNotificationType: 'currentGroup/changeNotificationType',
  },
})('GroupSettings', GroupSettings)
</script>
