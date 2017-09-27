<script>
import { connect } from 'vuex-connect'
import VerifyMail from '@/components/Login/VerifyMail.vue'

export default connect({
  gettersToProps: {
    status: 'verifymail/status',
    user: 'auth/user',
  },
  lifecycle: {
    // when page is loaded, use the `?key` route parameter to trigger verification
    mounted: ({ getters, dispatch }) => dispatch('verifymail/verify', getters['route/query'].key),
    destroyed: ({ dispatch }) => dispatch('verifymail/clean'),
  },
})('VerifyMail', VerifyMail)
</script>
