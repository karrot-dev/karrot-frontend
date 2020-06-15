import activities from '@/activities/datastore/activities'
import activityPlugin from '@/activities/datastore/activityPlugin'
import activitySeries from '@/activities/datastore/activitySeries'

export default {
  modules: {
    activities,
    activitySeries,
  },
  plugins: [
    activityPlugin,
  ],
}
