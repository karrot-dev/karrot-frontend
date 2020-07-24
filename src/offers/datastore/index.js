import offers, { plugin as offersPlugin } from '@/offers/datastore/offers'
import currentOffer, { plugin as currentOfferPlugin } from '@/offers/datastore/currentOffer'

export default {
  modules: {
    offers,
    currentOffer,
  },
  plugins: [
    offersPlugin,
    currentOfferPlugin,
  ],
}
