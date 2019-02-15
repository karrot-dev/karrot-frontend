<script>
import { connect } from 'vuex-connect'
import SidenavPlaceUI from './SidenavPlaceUI'

export default connect({
  gettersToProps: {
    place: 'places/activePlace',
    wallUnreadCount: 'places/conversationUnreadCount',
    expanded: 'sidenavBoxes/toggle/place',
    isEditor: 'currentGroup/isEditor',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/place',
  },
})('SidenavPlace', SidenavPlaceUI)
</script>
