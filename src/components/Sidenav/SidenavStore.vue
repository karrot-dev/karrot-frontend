<script>
import { connect } from 'vuex-connect'
import SidenavStoreUI from './SidenavStoreUI'

export default connect({
  gettersToProps: {
    storeId: 'stores/activeStoreId',
    collapsed: 'sidenavBoxes/storeCollapsed',
  },
  mutationsToEvents: {
    toggleBoxCollapsed: 'sidenavBoxes/toggleStoreCollapsed',
  },
})('SidenavStore', SidenavStoreUI)
</script>
