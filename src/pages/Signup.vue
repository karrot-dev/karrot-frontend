<script>
import { connect } from 'vuex-connect'
import Signup from '@/components/Login/Signup'

export default connect({
  gettersToProps: {
    status: 'users/signupStatus',
    requestError: 'users/signupError',
  },
  actionsToEvents: {
    submit: 'users/signup',
  },
  lifecycle: {
    destroyed: ({ dispatch }) => dispatch('users/cleanSignup'),
  },
})('Signup', Signup)
</script>
