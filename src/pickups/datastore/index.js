import pickups, { plugin as pickupsPlugin } from '@/pickups/datastore/pickups'
import pickupSeries from '@/pickups/datastore/pickupSeries'

export default {
  modules: {
    pickups,
    pickupSeries,
  },
  plugins: [
    pickupsPlugin,
  ],
}
