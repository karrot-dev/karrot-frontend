import * as Sentry from '@sentry/browser'

const SERVICE_WORKER_PATH = '/service-worker.js'
const SERVICE_WORKER_SCOPE = '/karrot-push'

export async function hasServiceWorker () {
  return (await getServiceWorkers()).length > 0
}

export async function getServiceWorker () {
  if (await hasServiceWorker()) return (await getServiceWorkers())[0]
}

async function getServiceWorkers () {
  if (__ENV.CORDOVA || !window.navigator.serviceWorker) return []
  let registrations
  try {
    registrations = await window.navigator.serviceWorker.getRegistrations()
  }
  catch (err) {
    Sentry.captureException(err)
    return []
  }
  return registrations.filter(worker => worker.scope.endsWith(SERVICE_WORKER_SCOPE))
}

async function getOrCreateWorker () {
  const worker = await getServiceWorker()
  if (worker) return worker
  return window.navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: SERVICE_WORKER_SCOPE })
}

let messaging
export async function initializeMessaging () {
  const { initializeApp, messaging: initializeMessaging } = await import('./firebase.lib')
  if (messaging) return messaging

  initializeApp({ messagingSenderId: __ENV.FCM_SENDER_ID })
  messaging = await initializeMessaging()
  messaging.useServiceWorker(await getOrCreateWorker())
  return messaging
}

/*
 * When we disable push notifications we need to remove the service workers.
 * If we remove them immediately, then re-enable push notifications then
 * firebase messsaging library gets upset. So we just remember whether we want them removed
 * only do it when the page actually closes.
 */

let shouldRemoveServiceWorkersOnUnload = false
export async function removeServiceWorkersOnUnload (value) {
  shouldRemoveServiceWorkersOnUnload = value
}

async function removeServiceWorkers () {
  for (const worker of await getServiceWorkers()) {
    worker.unregister()
  }
}

window.onbeforeunload = () => {
  // Do not return anything from this function or it triggers a browser dialog
  if (shouldRemoveServiceWorkersOnUnload) removeServiceWorkers()
}
