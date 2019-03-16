<script>
import { connect } from 'vuex-connect'
import SidenavPlacesUI from './SidenavPlacesUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    places: 'places/byCurrentGroup',
    showAllPlaces: 'places/toggle/showAll',
    archived: 'places/byCurrentGroupArchived',
    expanded: 'sidenavBoxes/toggle/places',
    isEditor: 'currentGroup/isEditor',
    fetchStatus: 'places/fetchStatus',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/places',
    toggleShowAllPlaces: 'places/toggle/showAll',
  },
})('SidenavPlaces', SidenavPlacesUI)
</script>
