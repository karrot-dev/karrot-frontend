<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI.vue'

export default connect({
  gettersToProps: {
    showStores: 'sidenav/showMapStores',
    showUsers: 'sidenav/showMapUsers'
  },
  actionsToEvents: {
    toggleStores: 'sidenav/toggleMapStores',
    toggleUsers: 'sidenav/toggleMapUsers'
  }
})('sidenavMap', SidenavMapUI)
</script>
