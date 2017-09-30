<script>
import { connect } from 'vuex-connect'
import InvitationsUI from '@/components/Group/InvitationsUI.vue'

export default connect({
  gettersToProps: {
    invitations: 'invitations/list',
    listStatus: 'invitations/listStatus',
    sendStatus: 'invitations/sendStatus',
  },
  actionsToEvents: {
    submit: 'invitations/send',
  },
  lifecycle: {
    created: ({ dispatch }) => dispatch('invitations/fetchForActiveGroup'),
  },
})('GroupInvites', InvitationsUI)
</script>
