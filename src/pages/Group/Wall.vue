<script>
import { connect } from 'vuex-connect'
import Wall from '@/components/Wall/Wall'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    availablePickups: 'pickups/available',
    feedbackPossible: 'pickups/feedbackPossible',
    conversation: 'currentGroup/conversation',
    user: 'auth/user',
  },
  actionsToEvents: {
    join: 'pickups/join',
    leave: 'pickups/leave',
    detail: 'detail/openForPickup',
    send: 'conversations/send',
    saveMessage: 'conversations/saveMessage',
    markAllRead: 'conversations/markAllRead',
    toggleEmailNotifications: 'conversations/maybeToggleEmailNotifications',
    toggleReaction: 'conversations/toggleReaction',
  },
  actionsToProps: {
    fetchMore: 'conversations/fetchMore',
  },
})('GroupWall', Wall)
</script>
