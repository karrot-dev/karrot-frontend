import pwa, { plugin as pwaPlugin } from '@/utils/datastore/pwa'

export default {
  modules: {
    pwa,
  },
  plugins: [
    pwaPlugin,
  ],
}
