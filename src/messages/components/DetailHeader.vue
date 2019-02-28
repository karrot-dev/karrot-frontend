<script>
import { connect } from 'vuex-connect'
import DetailHeaderUI from './DetailHeaderUI'

export default connect({
  gettersToProps: {
    user: 'detail/user',
    pickup: 'detail/pickup',
    application: 'detail/application',
    conversation: 'detail/conversation',
    currentUser: 'auth/user',
  },
  actionsToEvents: {
    saveConversation: 'conversations/maybeSave',
  },
})('DetailHeader', DetailHeaderUI)
</script>
