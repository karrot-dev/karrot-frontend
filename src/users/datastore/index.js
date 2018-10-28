import users, { plugin as usersPlugin } from '@/users/datastore/users'

export default {
  modules: {
    users,
  },
  plugins: [
    usersPlugin,
  ],
}
