<script>
import { connect } from 'vuex-connect'
import DetailUI from './DetailUI'

export default connect({
  gettersToProps: {
    user: 'detail/user',
    pickup: 'detail/pickup',
    application: 'detail/application',
    conflict: 'detail/conflictResolution',
    conversation: 'detail/conversation',
    away: 'presence/toggle/away',
    currentUser: 'auth/user',
  },
  actionsToEvents: {
    send: 'conversations/send',
    mark: 'conversations/maybeMark',
    toggleReaction: 'conversations/toggleReaction',
    saveMessage: 'conversations/saveMessage',
    fetchPast: 'conversations/fetchPast',
    fetchFuture: 'currentThread/fetchFuture',
  },
})('Detail', DetailUI)
</script>
