// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import loadingProgressReporterPlugin from '@/topbar/datastore/loadingProgressReporter'
import breadcrumbs from '@/topbar/datastore/breadcrumbs'
import loadingprogress from '@/topbar/datastore/loadingprogress'
import search from '@/topbar/datastore/search'

export default {
  modules: {
    breadcrumbs,
    loadingprogress,
    search,
  },
  plugins: [
    loadingProgressReporterPlugin,
  ],
}
