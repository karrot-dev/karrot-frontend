<script>
import { connect } from 'vuex-connect'
import Wall from '@/group/components/Wall'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    availablePickups: 'pickups/available',
    feedbackPossible: 'pickups/feedbackPossible',
    applications: 'groupApplications/forCurrentGroupPending',
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
  },
})('GroupWall', Wall)
</script>
