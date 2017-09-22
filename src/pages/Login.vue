<script>
import { connect } from 'vuex-connect'
import Login from '@/components/Login/Login.vue'

export default connect({
  gettersToProps: {
    status: 'auth/status',
  },
  actionsToEvents: {
    submit: 'auth/login',
  },
  lifecycle: {
    destroyed: ({ dispatch }) => dispatch('auth/cleanStatus'),
  },
})('Login', Login)
</script>
