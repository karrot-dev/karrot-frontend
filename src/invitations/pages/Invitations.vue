<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


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
