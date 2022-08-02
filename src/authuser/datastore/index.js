import auth, { plugin as authPlugin } from '@/authuser/datastore/auth'

export default {
  modules: {
    auth,
  },
  plugins: [
    authPlugin,
  ],
}
