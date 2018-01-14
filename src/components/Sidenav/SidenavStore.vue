<script>
import { connect } from 'vuex-connect'
import SidenavStoreUI from './SidenavStoreUI'

export default connect({
  gettersToProps: {
    storeId: 'stores/activeStoreId',
    expanded: 'sidenavBoxes/toggle/store',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/store',
  },
})('SidenavStore', SidenavStoreUI)
</script>
