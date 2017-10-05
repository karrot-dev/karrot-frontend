<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI.vue'

export default connect({
  gettersToProps: {
    stores: 'stores/all',
    users: 'users/all',
    showStores: 'sidenav/showMapStores',
    showUsers: 'sidenav/showMapUsers',
  },
  actionsToEvents: {
    toggleStores: 'sidenav/toggleMapStores',
    toggleUsers: 'sidenav/toggleMapUsers',
  },
})('SidenavMap', SidenavMapUI)
</script>
