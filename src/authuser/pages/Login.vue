<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import Login from '@/authuser/components/Login'

export default connect({
  gettersToProps: {
    status: 'auth/loginStatus',
  },
  actionsToEvents: {
    submit: 'auth/login',
  },
})('Login', Login)
</script>
