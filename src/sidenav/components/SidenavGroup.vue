<script>
import { connect } from 'vuex-connect'
import SidenavGroupUI from './SidenavGroupUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    features: 'currentGroup/features',
    wallUnreadCount: 'status/currentGroupWallUnreadCount',
    feedbackPossibleCount: 'status/currentGroupFeedbackPossibleCount',
    pendingApplicationCount: 'status/currentGroupPendingApplicationCount',
  },
})('SidenavGroup', SidenavGroupUI)
</script>
