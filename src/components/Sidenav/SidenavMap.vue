<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byActiveGroup',
    users: 'users/all',
    showStores: 'sidenav/showMapStores',
    showUsers: 'sidenav/showMapUsers',
    selectedStoreId: 'stores/activeStoreId',
  },
  actionsToEvents: {
    toggleStores: 'sidenav/toggleMapStores',
    toggleUsers: 'sidenav/toggleMapUsers',
  },
})('SidenavMap', SidenavMapUI)
</script>
