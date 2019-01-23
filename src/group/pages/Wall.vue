<script>
import { connect } from 'vuex-connect'
import Wall from '@/group/components/Wall'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    availablePickups: 'pickups/available',
    feedbackPossible: 'pickups/feedbackPossibleByCurrentGroup',
    applications: 'applications/forCurrentGroupPending',
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
    setMuted: 'conversations/maybeSetMuted',
    toggleReaction: 'conversations/toggleReaction',
  },
  actionsToProps: {
    fetchPast: 'conversations/fetchPast',
  },
})('GroupWall', Wall)
</script>
