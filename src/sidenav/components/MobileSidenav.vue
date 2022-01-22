<script>
import { connect } from 'vuex-connect'
import MobileSideNavUI from './MobileSideNavUI'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
  },
  gettersToProps: {
    currentUserId: 'auth/userId',
  },
  methodsToEvents: {
    toggleSideNav ({ commit }) {
      this.$emit('toggle-sidenav')
    },
  },
})('MobileSideNav', MobileSideNavUI)
</script>
