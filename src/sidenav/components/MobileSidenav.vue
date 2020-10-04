<script>
import { connect } from 'vuex-connect'
import MobileSidenavUI from './MobileSidenavUI'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
  },
  gettersToProps: {
    currentUserId: 'auth/userId',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggle-sidenav')
    },
  },
})('MobileSidenav', MobileSidenavUI)
</script>
