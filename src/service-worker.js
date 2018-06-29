/*
 *  IMPORTANT!!
 *
 *  This file has its own webpack build.
 *
 *  For production it will be built correctly when you do `yarn build`.
 *
 *  For development it will be built ONCE when you run `yarn dev`, after that you have to run it manually.
 *
 *  If you want to actually use it you must have FCM_SENDER_ID environment variable set to a valid value.
 *
 *  See https://docs.karrot.world/mobile.html for a hint ... you'll need to dig around a bit more on
 *  https://console.firebase.google.com/ though to find the sender id.
 *
 */

import 'firebase/messaging'
import { initializeApp, messaging as initializeMessaging } from 'firebase/app'

initializeApp({ messagingSenderId: FCM_SENDER_ID })

const messaging = initializeMessaging()

messaging.setBackgroundMessageHandler(payload => {
  // not actually used, but without it here firefox does not receive messages...
  console.log('received payload', payload)
})

// Ensure new workers to replace old ones...
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})
