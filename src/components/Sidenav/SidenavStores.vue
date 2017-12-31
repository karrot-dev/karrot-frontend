<script>
import { connect } from 'vuex-connect'
import SidenavStoresUI from './SidenavStoresUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byCurrentGroup',
    collapsed: 'sidenavBoxes/storesCollapsed',
  },
  mutationsToEvents: {
    toggleBoxCollapsed: 'sidenavBoxes/toggleStoresCollapsed',
  },
})('SidenavStores', SidenavStoresUI)
</script>
