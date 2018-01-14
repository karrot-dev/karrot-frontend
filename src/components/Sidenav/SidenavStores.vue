<script>
import { connect } from 'vuex-connect'
import SidenavStoresUI from './SidenavStoresUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byCurrentGroup',
    expanded: 'sidenavBoxes/toggle/stores',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/stores',
  },
})('SidenavStores', SidenavStoresUI)
</script>
