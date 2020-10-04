<script>
import { connect } from 'vuex-connect'
import DetailUI from './DetailUI'

export default connect({
  gettersToProps: {
    user: 'detail/user',
    activity: 'detail/activity',
    application: 'detail/application',
    conversation: 'detail/conversation',
    away: 'presence/toggle/away',
    currentUser: 'auth/user',
  },
  actionsToEvents: {
    send: 'conversations/send',
    mark: 'conversations/maybeMark',
    'toggle-reaction': 'conversations/toggleReaction',
    'save-message': 'conversations/saveMessage',
    'fetch-past': 'conversations/fetchPast',
    'fetch-future': 'currentThread/fetchFuture',
  },
})('Detail', DetailUI)
</script>
