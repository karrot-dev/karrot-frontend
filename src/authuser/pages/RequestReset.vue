<script>
import { connect } from 'vuex-connect'
import RequestPasswordReset from '@/components/Login/RequestPasswordReset'

export default connect({
  gettersToProps: {
    status: 'users/requestResetPasswordStatus',
  },
  actionsToEvents: {
    submit: 'users/requestResetPassword',
  },
})('RequestPasswordReset', RequestPasswordReset)
</script>
