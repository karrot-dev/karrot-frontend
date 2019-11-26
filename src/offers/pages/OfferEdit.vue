<script>
import { connect } from 'vuex-connect'
import OfferForm from '@/offers/components/OfferForm'

export default connect({
  gettersToProps: {
    fetching: 'currentOffer/fetching',
    value: 'currentOffer/value',
    status: 'currentOffer/saveStatus',
  },
  actionsToEvents: {
    save: 'offers/save',
  },
  methodsToEvents: {
    reset: ({ dispatch }) => dispatch('meta/clear', ['save']),
  },
})('OfferEdit', OfferForm)
</script>
