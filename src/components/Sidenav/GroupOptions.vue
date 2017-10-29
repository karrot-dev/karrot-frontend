<script>
import { connect } from 'vuex-connect'
import GroupOptionsUI from './GroupOptionsUI'

export default connect({
  gettersToProps: {
    activeGroupId: 'groups/activeGroupId',
  },
  actionsToEvents: {
    leave: 'groups/leave',
  },
})('GroupOptions', GroupOptionsUI)
</script>
