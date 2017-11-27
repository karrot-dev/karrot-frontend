<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byCurrentGroup',
    users: 'users/byCurrentGroup',
    showStores: 'sidenav/showMapStores',
    showUsers: 'sidenav/showMapUsers',
    selectedStoreId: 'stores/activeStoreId',
    currentGroup: 'currentGroup/value',
  },
  actionsToEvents: {
    toggleStores: 'sidenav/toggleMapStores',
    toggleUsers: 'sidenav/toggleMapUsers',
  },
})('SidenavMap', SidenavMapUI)
</script>
