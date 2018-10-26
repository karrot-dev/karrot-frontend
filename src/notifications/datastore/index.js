import notifications, { plugin as notificationsPlugin } from '@/notifications/datastore/notifications'

export default {
  modules: {
    notifications,
  },
  plugins: [
    notificationsPlugin,
  ],
}
