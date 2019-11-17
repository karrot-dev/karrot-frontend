<script>
import { connect } from 'vuex-connect'
import OfferForm from '@/offers/components/OfferForm'

export default connect({
  gettersToProps: {
    status: 'offers/createStatus',
  },
  actionsToEvents: {
    save: 'offers/create',
  },
  methodsToEvents: {
    // TODO: do I need this one?
    reset: ({ dispatch }) => dispatch('meta/clear', ['create']),
  },
})('OfferCreate', OfferForm)
</script>
