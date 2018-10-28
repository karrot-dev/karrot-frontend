<script>
import { connect } from 'vuex-connect'
import Login from '@/authuser/components/Login'

export default connect({
  gettersToProps: {
    status: 'auth/loginStatus',
  },
  actionsToEvents: {
    submit: 'auth/login',
  },
})('Login', Login)
</script>
