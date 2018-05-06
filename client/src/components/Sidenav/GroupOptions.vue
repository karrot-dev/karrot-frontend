<script>
import { connect } from 'vuex-connect'
import GroupOptionsUI from './GroupOptionsUI'

export default connect({
  gettersToProps: {
    currentGroupId: 'currentGroup/id',
    roles: 'currentGroup/roles',
  },
  actionsToEvents: {
    leave: 'groups/leave',
  },
})('GroupOptions', GroupOptionsUI)
</script>
