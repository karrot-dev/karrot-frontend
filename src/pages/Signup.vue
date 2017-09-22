<script>
import { connect } from 'vuex-connect'
import Signup from '@/components/Login/Signup.vue'

export default connect({
  gettersToProps: {
    status: 'users/signupStatus',
  },
  actionsToEvents: {
    submit: 'users/signup',
  },
  lifecycle: {
    destroyed: ({ dispatch }) => dispatch('users/cleanSignup'),
  },
})('Signup', Signup)
</script>
