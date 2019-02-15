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
