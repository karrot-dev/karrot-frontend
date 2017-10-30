<script>
import { connect } from 'vuex-connect'
import GroupOptionsUI from './GroupOptionsUI'

export default connect({
  gettersToProps: {
    activeGroupId: 'groups/activeGroupId',
    roles: 'groups/activeGroupRoles',
  },
  actionsToEvents: {
    leave: 'groups/leave',
  },
})('GroupOptions', GroupOptionsUI)
</script>
