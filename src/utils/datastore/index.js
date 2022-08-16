import about, { plugin as aboutPlugin } from '@/utils/datastore/about'
import connectivity from '@/utils/datastore/connectivity'
import presence from '@/utils/datastore/presence'
import pwa, { plugin as pwaPlugin } from '@/utils/datastore/pwa'

export default {
  modules: {
    about,
    connectivity,
    presence,
    pwa,
  },
  plugins: [
    aboutPlugin,
    pwaPlugin,
  ],
}
