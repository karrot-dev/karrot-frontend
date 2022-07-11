// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import applications from '@/applications/datastore/applications'
import applicationsPlugin from '@/applications/datastore/applicationsPlugin'

export default {
  modules: {
    applications,
  },
  plugins: [
    applicationsPlugin,
  ],
}
