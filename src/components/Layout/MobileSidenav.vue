<script>
import { connect } from 'vuex-connect'
import MobileSidenavUI from './MobileSidenavUI.vue'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
  },
  gettersToProps: {
    currentUserId: 'auth/userId',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggleSidenav')
    },
  },
})('MobileSidenav', MobileSidenavUI)
</script>
