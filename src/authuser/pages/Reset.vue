<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

<script>
import { connect } from 'vuex-connect'
import PasswordReset from '@/authuser/components/PasswordReset'

export default connect({
  gettersToProps: {
    status: 'users/resetPasswordStatus',
    code: 'route/code',
  },
  actionsToEvents: {
    submit: 'users/resetPassword',
  },
})('PasswordReset', PasswordReset)
</script>
