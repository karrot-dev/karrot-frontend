<script>
import { connect } from 'vuex-connect'
import SidenavPlacesUI from './SidenavPlacesUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    places: 'places/byCurrentGroup',
    showAllPlaces: 'places/toggle/showAll',
    archived: 'places/byCurrentGroupArchived',
    isEditor: 'currentGroup/isEditor',
    fetchStatus: 'places/fetchStatus',
  },
  actionsToEvents: {
    'toggle-show-all-places': 'places/toggle/showAll',
  },
})('SidenavPlaces', SidenavPlacesUI)
</script>
