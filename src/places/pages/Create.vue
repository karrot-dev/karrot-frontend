<script>
import { connect } from 'vuex-connect'
import router from '@/base/router'
import PlaceEdit from '@/places/components/PlaceEdit'

export default connect({
  gettersToProps: {
    allPlaces: 'places/byCurrentGroup',
    status: 'places/createStatus',
  },
  actionsToEvents: {
    save: 'places/create',
  },
  methodsToEvents: {
    cancel: () => router.go(-1),
  },
})('PlaceCreate', PlaceEdit)
</script>
