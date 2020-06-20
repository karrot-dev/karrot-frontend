import activities from '@/activities/datastore/activities'
import activityPlugin from '@/activities/datastore/activityPlugin'
import activitySeries, { plugin as activitySeriesPlugin } from '@/activities/datastore/activitySeries'

export default {
  modules: {
    activities,
    activitySeries,
  },
  plugins: [
    activityPlugin,
    activitySeriesPlugin,
  ],
}
