// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import places from '@/places/datastore/places'
import plugin from '@/places/datastore/plugin'

export default {
  modules: {
    places,
  },
  plugins: [
    plugin,
  ],
}
