<script>
import { connect } from 'vuex-connect'
import GroupSettings from '@/group/components/GroupSettings'

export default connect({
  gettersToProps: {
    group: 'currentGroup/value',
    user: 'auth/user',
  },
  actionsToEvents: {
    changeNotificationType: 'currentGroup/changeNotificationType',
  },
})('GroupSettings', GroupSettings)
</script>
