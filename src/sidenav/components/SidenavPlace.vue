<script>
import { connect } from 'vuex-connect'
import SidenavPlaceUI from './SidenavPlaceUI'

export default connect({
  gettersToProps: {
    placeId: 'places/activePlaceId',
    expanded: 'sidenavBoxes/toggle/place',
    isEditor: 'currentGroup/isEditor',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/place',
  },
})('SidenavPlace', SidenavPlaceUI)
</script>
