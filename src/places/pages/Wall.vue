<script>
import { connect } from 'vuex-connect'
import Wall from '@/group/components/Wall'

export default connect({
  gettersToProps: {
    conversation: 'places/conversation',
    user: 'auth/user',
  },
  actionsToEvents: {
    detail: 'detail/openForPickup',
    openThread: 'detail/openForThread',
    send: 'conversations/send',
    saveMessage: 'conversations/saveMessage',
    markAllRead: 'conversations/markAllRead',
    saveConversation: 'conversations/maybeSave',
    toggleReaction: 'conversations/toggleReaction',
  },
  actionsToProps: {
    fetchPast: 'conversations/fetchPast',
  },
})('PlaceWall', Wall)
</script>
