// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import history, { plugin } from '@/history/datastore/history'

export default {
  modules: {
    history,
  },
  plugins: [
    plugin,
  ],
}
