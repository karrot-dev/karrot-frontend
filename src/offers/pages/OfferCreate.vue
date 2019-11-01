<script>
import { connect } from 'vuex-connect'
import OfferEdit from '@/offers/pages/OfferEdit'

export default connect({
  /*
  gettersToProps: {
    timezones: 'timezones/autocompleteData',
    allGroups: 'groups/all',
    status: 'groups/createStatus',
  },
  actionsToEvents: {
    save: 'groups/create',
  },
  methodsToEvents: {
    reset: ({ dispatch }) => dispatch('meta/clear', ['create']),
  },
   */
})('OfferCreate', OfferEdit)
</script>
