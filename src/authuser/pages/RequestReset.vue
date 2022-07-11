<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

<script>
import { connect } from 'vuex-connect'
import RequestPasswordReset from '@/authuser/components/RequestPasswordReset'

export default connect({
  gettersToProps: {
    status: 'users/requestResetPasswordStatus',
  },
  actionsToEvents: {
    submit: 'users/requestResetPassword',
  },
})('RequestPasswordReset', RequestPasswordReset)
</script>
