import currentOffer, { plugin as currentOfferPlugin } from '@/offers/datastore/currentOffer'

export default {
  modules: {
    currentOffer,
  },
  plugins: [
    currentOfferPlugin,
  ],
}
