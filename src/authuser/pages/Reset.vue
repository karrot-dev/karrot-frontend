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
