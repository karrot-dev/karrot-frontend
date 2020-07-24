import places from '@/places/datastore/places'
import plugin from '@/places/datastore/plugin'

export default {
  modules: {
    places,
  },
  plugins: [
    plugin,
  ],
}
