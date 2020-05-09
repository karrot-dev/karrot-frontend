import status, { plugin as statusPlugin } from '@/status/datastore/status'

export default {
  modules: {
    status,
  },
  plugins: [
    statusPlugin,
  ],
}
