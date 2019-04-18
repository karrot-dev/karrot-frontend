import pickups from '@/pickups/datastore/pickups'
import pickupPlugin from '@/pickups/datastore/pickupPlugin'
import pickupSeries from '@/pickups/datastore/pickupSeries'
import meetings from '@/pickups/datastore/meetings'

export default {
  modules: {
    pickups,
    pickupSeries,
    meetings,
  },
  plugins: [
    pickupPlugin,
  ],
}
