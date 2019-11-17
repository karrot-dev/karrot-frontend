<script>
import { connect } from 'vuex-connect'
import OfferForm from '@/offers/components/OfferForm'

export default connect({
  gettersToProps: {
    value: 'currentOffer/value',
    status: 'currentOffer/saveStatus',
  },
  actionsToEvents: {
    save: 'offers/save',
  },
  methodsToEvents: {
    // TODO: do I need this one?
    reset: ({ dispatch }) => dispatch('meta/clear', ['create']),
  },
})('OfferEdit', OfferForm)
</script>
