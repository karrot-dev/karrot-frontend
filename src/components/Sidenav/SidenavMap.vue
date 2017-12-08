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
  },
  mutationsToEvents: {
    toggleStores: 'map/toggleStores',
    toggleUsers: 'map/toggleUsers',
  },
})('SidenavMap', SidenavMapUI)
</script>
