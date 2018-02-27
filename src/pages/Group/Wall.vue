<script>
import { connect } from 'vuex-connect'
import Wall from '@/components/Wall/Wall'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    availablePickups: 'pickups/available',
    feedbackPossible: 'pickups/feedbackPossible',
    conversation: 'conversations/active',
    user: 'auth/user',
  },
  actionsToEvents: {
    join: 'pickups/join',
    leave: 'pickups/leave',
    send: 'conversations/sendInActiveConversation',
    markAllRead: 'conversations/markAllReadInActiveConversation',
    toggleEmailNotifications: 'conversations/maybeToggleEmailNotifications',
  },
  actionsToProps: {
    fetchMore: 'conversations/fetchMoreForActiveConversation',
  },
})('GroupWall', Wall)
</script>
