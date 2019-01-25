<script>
import { connect } from 'vuex-connect'
import Wall from '@/group/components/Wall'

export default connect({
  gettersToProps: {
    conversation: 'stores/conversation',
    user: 'auth/user',
  },
  actionsToEvents: {
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
})('StoreWall', Wall)
</script>
