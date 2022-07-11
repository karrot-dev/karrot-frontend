<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


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
    reset: ({ dispatch }) => dispatch('offers/meta/clear', ['save']),
  },
})('OfferEdit', OfferForm)
</script>
