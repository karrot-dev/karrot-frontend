<script>
import { connect } from 'vuex-connect'
import MobileSidenavUI from './MobileSidenavUI'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
  },
  gettersToProps: {
    currentUserId: 'auth/userId',
    currentGroupId: 'currentGroup/id',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggleSidenav')
    },
  },
})('MobileSidenav', MobileSidenavUI)
</script>
