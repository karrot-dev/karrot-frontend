<script>
import { connect } from 'vuex-connect'
import Signup from '@/authuser/components/Signup'

export default connect({
  gettersToProps: {
    status: 'users/signupStatus',
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
