<script>
import { connect } from 'vuex-connect'
import ChatListUI from '@/components/Conversation/ChatListUI'

export default connect({
  gettersToProps: {
    data: 'conversations/active',
  },
  actionsToEvents: {
    addFloater: 'chatFloaters/add',
  },
})('ChatList', ChatListUI)
</script>
