<script>
import { connect } from 'vuex-connect'
import SidenavGroupUI from './SidenavGroupUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    wallUnreadCount: 'currentGroup/conversationUnreadCount',
  },
})('SidenavGroup', SidenavGroupUI)
</script>
