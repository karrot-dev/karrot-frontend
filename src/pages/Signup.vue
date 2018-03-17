<script>
import { connect } from 'vuex-connect'
import Signup from '@/components/Login/Signup'

export default connect({
  gettersToProps: {
    status: 'users/signupStatus',
    hasPlayground: 'groups/hasPlayground',
    hasGroupToJoin: 'auth/hasJoinGroupAfterLogin',
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
