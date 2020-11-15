<script>
import { connect } from 'vuex-connect'
import SidenavMapUI from './SidenavMapUI'

export default connect({
  gettersToProps: {
    places: 'places/byCurrentGroup',
    users: 'users/byCurrentGroup',
    showPlaces: 'sidenavBoxes/toggle/placesOnMap',
    showUsers: 'sidenavBoxes/toggle/usersOnMap',
    selectedPlace: 'places/activePlace',
    selectedUser: 'users/activeUser',
    currentGroup: 'currentGroup/value',
    isEditor: 'currentGroup/isEditor',
  },
  actionsToEvents: {
    'toggle-places': 'sidenavBoxes/toggle/placesOnMap',
    'toggle-users': 'sidenavBoxes/toggle/usersOnMap',
  },
})('SidenavMap', SidenavMapUI)
</script>
