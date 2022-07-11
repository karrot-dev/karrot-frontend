// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import communityFeed, { plugin } from '@/communityFeed/datastore/communityFeed'

export default {
  modules: {
    communityFeed,
  },
  plugins: [
    plugin,
  ],
}
