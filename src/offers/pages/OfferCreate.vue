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
    reset: ({ dispatch }) => dispatch('offers/meta/clear', ['create']),
  },
})('OfferCreate', OfferForm)
</script>
