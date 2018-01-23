<script>
import { connect } from 'vuex-connect'
import ChatFloaterUI from '@/components/Conversation/ChatFloaterUI'

export default connect({
  gettersToProps: {
    data: 'conversations/active',
    user: 'auth/user',
  },
  actionsToEvents: {
    send: 'conversations/sendInActiveConversation',
  },
  actionsToProps: {
    fetchMore: 'conversations/fetchMoreForActiveConversation',
  },
})('ChatFloater', ChatFloaterUI)
</script>
