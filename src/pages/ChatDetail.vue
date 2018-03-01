<script>
import { connect } from 'vuex-connect'
import ChatMessages from '@/components/Conversation/ChatMessages'

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
})('ChatDetail', ChatMessages)
</script>
