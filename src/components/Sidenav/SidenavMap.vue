<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI'

export default connect({
  gettersToProps: {
    stores: 'stores/withLocation',
    users: 'users/withLocation',
    showStores: 'sidenav/showMapStores',
    showUsers: 'sidenav/showMapUsers',
    selectedStoreId: 'stores/activeStoreId',
    activeGroup: 'groups/activeGroup',
  },
  actionsToEvents: {
    toggleStores: 'sidenav/toggleMapStores',
    toggleUsers: 'sidenav/toggleMapUsers',
  },
})('SidenavMap', SidenavMapUI)
</script>
