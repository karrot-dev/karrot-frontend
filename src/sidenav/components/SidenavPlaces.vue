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
  lifecycle: {
    mounted (store) {
      const hasActivatedPlaces = store.getters['places/all'].filter(place => place.status === 'active').length > 0
      const showAll = store.getters['places/toggle/showAll']
      if (!hasActivatedPlaces && !showAll) {
        store.dispatch('places/toggle/showAll')
      }
    },
  },
})('SidenavPlaces', SidenavPlacesUI)
</script>
