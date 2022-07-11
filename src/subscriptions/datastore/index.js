// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


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
