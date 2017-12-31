<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byCurrentGroup',
    users: 'users/byCurrentGroup',
    showStores: 'map/showStores',
    showUsers: 'map/showUsers',
    selectedStoreId: 'stores/activeStoreId',
    currentGroup: 'currentGroup/value',
    collapsed: 'sidenavBoxes/mapCollapsed',
  },
  mutationsToEvents: {
    toggleStores: 'map/toggleStores',
    toggleUsers: 'map/toggleUsers',
    toggleBoxCollapsed: 'sidenavBoxes/toggleMapCollapsed',
  },
})('SidenavMap', SidenavMapUI)
</script>
