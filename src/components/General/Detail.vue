<script>
import { connect } from 'vuex-connect'
import DetailUI from './DetailUI'

export default connect({
  gettersToProps: {
    user: 'detail/user',
    pickup: 'detail/pickup',
    conversation: 'detail/conversation',
    away: 'presence/toggle/away',
    currentUser: 'auth/user',
  },
  actionsToEvents: {
    send: 'conversations/send',
    mark: 'conversations/mark',
    toggleEmailNotifications: 'conversations/maybeToggleEmailNotifications',
    toggleReaction: 'conversations/toggleReaction',
    saveMessage: 'conversations/saveMessage',
    fetchPast: 'conversations/fetchPast',
    fetchFuture: 'currentThread/fetchFuture',
  },
})('Detail', DetailUI)
</script>
