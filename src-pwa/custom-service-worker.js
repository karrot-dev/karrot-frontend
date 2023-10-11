/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "injectManifest"
 *
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// Ensures new workers replace old ones immediately, without waiting until the old one has unloaded
self.skipWaiting()

// Take over all Karrot pages in the browser, even when they haven't been opened through the service worker
clientsClaim()

self.addEventListener('push', event => {
  const data = event.data?.json()
  const {
    title,
    body,
    url,
    tag,
    image_url: imageUrl,
  } = data

  // See stuff you can set here https://developer.mozilla.org/en-US/docs/Web/API/Notification
  const options = {
    data: {},
  }

  if (body) {
    options.body = body
  }

  if (tag) {
    options.tag = tag
    options.renotify = true
  }

  if (url) {
    options.data.url = url
  }

  if (imageUrl) {
    options.icon = imageUrl
  }

  event.waitUntil(
    self.registration.showNotification(title, options),
  )
})

self.addEventListener('notificationclick', event => {
  event.preventDefault()
  if (event.notification.data.url) {
    event.waitUntil(
      event.notification.close(),
      self.clients.openWindow(event.notification.data.url),
    )
  }
  else {
    event.waitUntil(
      event.notification.close(),
    )
  }
})

// __WB_MANIFEST is used by injectManifest to set the files for caching
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()
