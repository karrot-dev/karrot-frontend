<script>
import { connect } from 'vuex-connect'
import InvitationsUI from '@/components/Group/InvitationsUI'

export default connect({
  gettersToProps: {
    invitations: 'invitations/list',
    fetchStatus: 'invitations/fetchStatus',
    sendStatus: 'invitations/sendStatus',
  },
  actionsToEvents: {
    submit: 'invitations/send',
  },
})('GroupInvitations', InvitationsUI)
</script>
