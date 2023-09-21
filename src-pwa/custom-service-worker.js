/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "injectManifest"
 *
 * See https://docs.karrot.world/mobile.html for a hint ... you'll need to dig around a bit more on
 * https://console.firebase.google.com/ though to find the sender id.
 *
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// Ensures new workers replace old ones immediately, without waiting until the old one has unloaded
self.skipWaiting()

// Take over all Karrot pages in the browser, even when they haven't been opened through the service worker
clientsClaim()

self.addEventListener('push', event => {
  console.log('got push event!', event)
  const data = event.data?.json()
  const { head, body, url } = data
  event.waitUntil(
    self.registration.showNotification(head, {
      body,
      data: { url },
      actions: [
        {
          action: 'blah',
          title: 'Do It!',
        },
      ],
    }),
  )
})

self.addEventListener('notificationclick', event => {
  event.preventDefault()
  event.waitUntil(
    event.notification.close(),
    self.clients.openWindow(event.notification.data.url),
  )
})

// require('./firebase').init()

// __WB_MANIFEST is used by injectManifest to set the files for caching
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()
