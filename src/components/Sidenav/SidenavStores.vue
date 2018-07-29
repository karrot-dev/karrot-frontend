<script>
import { connect } from 'vuex-connect'
import SidenavStoresUI from './SidenavStoresUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byCurrentGroup',
    showAllStores: 'stores/toggle/showAll',
    archived: 'stores/byCurrentGroupArchived',
    expanded: 'sidenavBoxes/toggle/stores',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/stores',
    toggleShowAllStores: 'stores/toggle/showAll',
  },
})('SidenavStores', SidenavStoresUI)
</script>
