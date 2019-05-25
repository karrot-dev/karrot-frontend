<script>
import { connect } from 'vuex-connect'
import GroupSettings from '@/group/components/GroupSettings'

export default connect({
  gettersToProps: {
    group: 'currentGroup/value',
    groups: 'groups/mine',
  },
  actionsToEvents: {
    changeNotificationType: 'currentGroup/changeNotificationType',
    selectGroup: 'currentGroup/select',
  },
})('GroupSettings', GroupSettings)
</script>
