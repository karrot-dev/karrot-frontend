<script>
import { connect } from 'vuex-connect'
import DetailUI from './DetailUI'

export default connect({
  gettersToProps: {
    user: 'auth/user',
    pickup: 'detail/pickup',
    conversation: 'detail/conversation',
    away: 'presence/toggle/away',
  },
  actionsToEvents: {
    send: 'conversations/send',
    mark: 'conversations/mark',
    toggleEmailNotifications: 'conversations/maybeToggleEmailNotifications',
    toggleReaction: 'conversations/toggleReaction',
    fetchMore: 'conversations/fetchMore',
  },
})('Detail', DetailUI)
</script>
