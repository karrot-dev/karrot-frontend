<script>
import { connect } from 'vuex-connect'
import Chat from '@/components/Conversation/Chat'

export default connect({
  gettersToProps: {
    data: 'conversations/active',
    user: 'auth/user',
  },
  actionsToEvents: {
    send: 'conversations/sendInActiveConversation',
  },
})('Chat', Chat)
</script>
