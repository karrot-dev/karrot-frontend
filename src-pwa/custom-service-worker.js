/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 *
 * See https://docs.karrot.world/mobile.html for a hint ... you'll need to dig around a bit more on
 * https://console.firebase.google.com/ though to find the sender id.
 *
 */

import { precacheAndRoute } from 'workbox-precaching'
import { skipWaiting, clientsClaim } from 'workbox-core'

// Ensures new workers replace old ones immediately, without waiting until the old one has unloaded
skipWaiting()

// Take over all Karrot pages in the browser, even when they haven't been opened through the service worker
clientsClaim()

require('./firebase').init()

// __WB_MANIFEST is used by InjectManifest to set the files for caching
precacheAndRoute(self.__WB_MANIFEST)
