<script>
import { connect } from 'vuex-connect'
import SideNavGroupUI from './SideNavGroupUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    theme: 'currentGroup/theme',
    features: 'currentGroup/features',
    wallUnreadCount: 'status/currentGroupWallUnreadCount',
    feedbackPossibleCount: 'status/currentGroupFeedbackPossibleCount',
    pendingApplicationCount: 'status/currentGroupPendingApplicationCount',
  },
})('SideNavGroup', SideNavGroupUI)
</script>
