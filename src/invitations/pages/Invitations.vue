<script>
import { connect } from 'vuex-connect'
import InvitationsUI from '@/invitations/components/InvitationsUI'

export default connect({
  gettersToProps: {
    invitations: 'invitations/byCurrentGroup',
    fetchStatus: 'invitations/fetchStatus',
    sendStatus: 'invitations/sendStatus',
  },
  actionsToEvents: {
    submit: 'invitations/send',
  },
})('GroupInvitations', InvitationsUI)
</script>
