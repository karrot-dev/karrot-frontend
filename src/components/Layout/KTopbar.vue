<script>
import { connect } from 'vuex-connect'
import KTopbarUI from './KTopbarUI.vue'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
  },
  gettersToProps: {
    breadcrumbs: 'breadcrumbs/all',
    currentUserId: 'auth/userId',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggleSidenav')
    },
  },
})('KTopbar', KTopbarUI)
</script>
