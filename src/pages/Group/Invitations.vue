<script>
import { connect } from 'vuex-connect'
import InvitationsUI from '@/components/Group/InvitationsUI.vue'

export default connect({
  gettersToProps: {
    invitations: 'invitations/list',
    listStatus: 'invitations/listStatus',
    sendStatus: 'invitations/sendStatus',
    serverError: 'invitations/sendError',
  },
  actionsToEvents: {
    submit: 'invitations/send',
  },
  lifecycle: {
    mounted: ({ dispatch }) => dispatch('invitations/fetchForActiveGroup'),
  },
})('GroupInvitations', InvitationsUI)
</script>
