<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byCurrentGroup',
    users: 'users/byCurrentGroup',
    showStores: 'sidenavBoxes/toggle/storesOnMap',
    showUsers: 'sidenavBoxes/toggle/usersOnMap',
    selectedStoreId: 'stores/activeStoreId',
    currentGroup: 'currentGroup/value',
    expanded: 'sidenavBoxes/toggle/map',
  },
  actionsToEvents: {
    toggleStores: 'sidenavBoxes/toggle/storesOnMap',
    toggleUsers: 'sidenavBoxes/toggle/usersOnMap',
    toggleBox: 'sidenavBoxes/toggle/map',
  },
})('SidenavMap', SidenavMapUI)
</script>
