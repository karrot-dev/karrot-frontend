<script>
import { connect } from 'vuex-connect'
import Login from '@/components/Login/Login'

export default connect({
  gettersToProps: {
    status: 'auth/loginStatus',
  },
  actionsToEvents: {
    submit: 'auth/login',
  },
  lifecycle: {
    destroyed: ({ dispatch }) => dispatch('auth/clearLoginStatus'),
  },
})('Login', Login)
</script>
