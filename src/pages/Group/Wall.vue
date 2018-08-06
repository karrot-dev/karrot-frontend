<script>
import { connect } from 'vuex-connect'
import Wall from '@/components/Wall/Wall'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    availablePickups: 'pickups/available',
    feedbackPossible: 'pickups/feedbackPossible',
    pending: 'groupApplications/pending',
    conversation: 'currentGroup/conversation',
    user: 'auth/user',
  },
  actionsToEvents: {
    join: 'pickups/join',
    leave: 'pickups/leave',
    detail: 'detail/openForPickup',
    openThread: 'detail/openForThread',
    send: 'conversations/send',
    saveMessage: 'conversations/saveMessage',
    markAllRead: 'conversations/markAllRead',
    toggleEmailNotifications: 'conversations/maybeToggleEmailNotifications',
    toggleReaction: 'conversations/toggleReaction',
  },
  actionsToProps: {
    fetchPast: 'conversations/fetchPast',
    refresh: 'refresh/refresh',
  },
})('GroupWall', Wall)
</script>
