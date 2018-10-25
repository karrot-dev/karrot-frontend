<script>
import { connect } from 'vuex-connect'
import SidenavStoresUI from './SidenavStoresUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    stores: 'stores/byCurrentGroup',
    showAllStores: 'stores/toggle/showAll',
    archived: 'stores/byCurrentGroupArchived',
    expanded: 'sidenavBoxes/toggle/stores',
    isEditor: 'currentGroup/isEditor',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/stores',
    toggleShowAllStores: 'stores/toggle/showAll',
  },
})('SidenavStores', SidenavStoresUI)
</script>
