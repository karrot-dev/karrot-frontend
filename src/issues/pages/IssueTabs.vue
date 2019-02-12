<script>
import { connect } from 'vuex-connect'
import IssueTabsUI from '@/issues/components/IssueTabsUI'

export default connect({
  gettersToProps: {
    issue: 'issues/current',
    conversation: 'issues/currentConversation',
  },
  actionsToEvents: {
    saveScores: 'issues/saveScores',
    send: 'conversations/send',
    saveMessage: 'conversations/saveMessage',
    markAllRead: 'conversations/markAllRead',
    setMuted: 'conversations/maybeSetMuted',
    toggleReaction: 'conversations/toggleReaction',
  },
})('IssueTabs', IssueTabsUI)
</script>
