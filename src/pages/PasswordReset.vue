<script>
import { connect } from 'vuex-connect'
import PasswordReset from '@/components/Login/PasswordReset'

export default connect({
  gettersToProps: {
    status: 'users/passwordresetStatus',
    requestError: 'users/passwordresetError',
  },
  actionsToEvents: {
    submit: 'users/resetPassword',
  },
})('PasswordReset', PasswordReset)
</script>
