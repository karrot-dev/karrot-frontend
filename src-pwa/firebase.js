// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import { getFirebaseConfig } from '@/subscriptions/firebase.config'

export async function init () {
  const firebaseConfig = await getFirebaseConfig()
  const app = initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  onBackgroundMessage(messaging, payload => {
    // not actually used, but without it here firefox does not receive messages...
    console.log('onBackgroundMessage', payload)
  })
}
