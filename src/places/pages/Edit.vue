<script>
import { connect } from 'vuex-connect'
import datastore from '@/base/datastore'
import PlaceEdit from '@/places/components/PlaceEdit'

export default connect({
  stateToProps: {
    status: () => {
      const active = datastore.getters['places/activePlace']
      return active && active.saveStatus
    },
  },
  gettersToProps: {
    value: 'places/activePlace',
    allPlaces: 'places/byCurrentGroup',
  },
  actionsToEvents: {
    save: 'places/save',
  },
})('PlaceEdit', PlaceEdit)
</script>
