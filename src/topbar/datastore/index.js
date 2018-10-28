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
