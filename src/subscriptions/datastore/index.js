import { plugin as authPushPlugin } from '@/subscriptions/datastore/auth/push'
import fcm, { plugin as fcmPlugin } from '@/subscriptions/datastore/fcm'

export default {
  modules: {
    fcm,
  },
  plugins: [
    fcmPlugin,
    authPushPlugin,
  ],
}
