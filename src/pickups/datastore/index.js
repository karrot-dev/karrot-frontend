import pickups from '@/pickups/datastore/pickups'
import pickupPlugin from '@/pickups/datastore/pickupPlugin'
import pickupSeries from '@/pickups/datastore/pickupSeries'

export default {
  modules: {
    pickups,
    pickupSeries,
  },
  plugins: [
    pickupPlugin,
  ],
}
