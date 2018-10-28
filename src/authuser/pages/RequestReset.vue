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
