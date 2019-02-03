<script>
import { connect } from 'vuex-connect'
import PlaceOptionsUI from './PlaceOptionsUI'

export default connect({
  gettersToProps: {
    placeId: 'places/activePlaceId',
  },
})('PlaceOptions', PlaceOptionsUI)
</script>
