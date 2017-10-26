<script>
import { connect } from 'vuex-connect'
import PasswordReset from '@/components/Login/PasswordReset.vue'

export default connect({
  gettersToProps: {
    status: 'users/passwordresetStatus',
    requestError: 'users/passwordresetError',
  },
  actionsToEvents: {
    submit: 'users/resetPassword',
  },
  lifecycle: {
    destroyed: ({ dispatch }) => dispatch('users/cleanPasswordreset'),
  },
})('PasswordReset', PasswordReset)
</script>
