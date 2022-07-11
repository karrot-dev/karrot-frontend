// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
