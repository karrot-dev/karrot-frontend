<script>
import { connect } from 'vuex-connect'
import Signup from '@/components/Login/Signup'

export default connect({
  gettersToProps: {
    status: 'users/signupStatus',
    requestError: 'users/signupError',
  },
  methodsToProps: {
    prefillEmail ({ getters }) {
      return getters['route/query'].email
    },
  },
  actionsToEvents: {
    submit: 'users/signup',
  },
})('Signup', Signup)
</script>
