import auth, { plugin as authPlugin } from '@/authuser/datastore/auth'
import deleteAccount from '@/authuser/datastore/deleteAccount'
import verifymail from '@/authuser/datastore/verifymail'

export default {
  modules: {
    deleteAccount,
    verifymail,
    auth,
  },
  plugins: [
    authPlugin,
  ],
}
