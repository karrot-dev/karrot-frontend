import activities from '@/activities/datastore/activities'
import activityTypes from '@/activities/datastore/activityTypes'
import activityPlugin from '@/activities/datastore/activityPlugin'
import activitySeries, { plugin as activitySeriesPlugin } from '@/activities/datastore/activitySeries'
import activityTypeStylesheetPlugin from '@/activities/datastore/activityTypeStylesheetPlugin'

export default {
  modules: {
    activities,
    activitySeries,
    activityTypes,
  },
  plugins: [
    activityPlugin,
    activitySeriesPlugin,
    activityTypeStylesheetPlugin,
  ],
}
