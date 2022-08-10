import loadingProgressReporterPlugin from '@/topbar/datastore/loadingProgressReporter'
import loadingprogress from '@/topbar/datastore/loadingprogress'
import search from '@/topbar/datastore/search'

export default {
  modules: {
    loadingprogress,
    search,
  },
  plugins: [
    loadingProgressReporterPlugin,
  ],
}
