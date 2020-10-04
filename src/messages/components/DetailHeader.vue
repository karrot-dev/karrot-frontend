<script>
import { connect } from 'vuex-connect'
import DetailHeaderUI from './DetailHeaderUI'

export default connect({
  gettersToProps: {
    user: 'detail/user',
    activity: 'detail/activity',
    application: 'detail/application',
    conversation: 'detail/conversation',
    currentUser: 'auth/user',
  },
  actionsToEvents: {
    'save-conversation': 'conversations/maybeSave',
  },
})('DetailHeader', DetailHeaderUI)
</script>
