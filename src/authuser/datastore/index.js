import auth, { plugin as authPlugin } from '@/authuser/datastore/auth'
import deleteAccount, { plugin as deleteAccountPlugin } from '@/authuser/datastore/deleteAccount'
import verifymail from '@/authuser/datastore/verifymail'

export default {
  modules: {
    deleteAccount,
    verifymail,
    auth,
  },
  plugins: [
    authPlugin,
    deleteAccountPlugin,
  ],
}
