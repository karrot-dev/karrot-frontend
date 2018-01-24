<script>
import { connect } from 'vuex-connect'
import ChatLinkUI from '@/components/Conversation/ChatLinkUI'

export default connect({
  actionsToEvents: {
    addFloater: 'chatFloaters/add',
  },
})('ChatLink', ChatLinkUI)
</script>
