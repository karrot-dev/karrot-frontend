<script>
import { connect } from 'vuex-connect'
import KTopbarUI from './KTopbarUI'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
  },
  gettersToProps: {
    breadcrumbs: 'breadcrumbs/all',
    currentUserId: 'auth/userId',
  },
})('KTopbar', KTopbarUI)
</script>
