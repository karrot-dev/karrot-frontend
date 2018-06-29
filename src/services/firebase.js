const SERVICE_WORKER_PATH = '/service-worker.js'
const SERVICE_WORKER_SCOPE = '/karrot-push'

export async function hasServiceWorker () {
  return (await getServiceWorkers()).length > 0
}

export async function getServiceWorker () {
  return (await getServiceWorkers())[0]
}

async function getServiceWorkers () {
  const registrations = await window.navigator.serviceWorker.getRegistrations()
  return registrations.filter(worker => worker.scope.endsWith(SERVICE_WORKER_SCOPE))
}

async function getOrCreateWorker () {
  const worker = getServiceWorker()
  if (worker) return worker
  return window.navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: SERVICE_WORKER_SCOPE })
}

let initializedApp = false
let messaging
export async function initializeMessaging () {
  const { initializeApp, messaging: initializeMessaging } = await import('./firebase.lib')
  if (messaging) return messaging

  if (!initializedApp) {
    initializeApp({
      messagingSenderId: FCM_SENDER_ID,
    })
    initializedApp = true
  }

  console.log('initializing messaging')
  messaging = await initializeMessaging()
  console.log('use worker!')
  messaging.useServiceWorker(await getOrCreateWorker())

  const worker = await getOrCreateWorker()

  console.log('worker!', worker)

  window.w = worker

  messaging.onTokenRefresh(token => {
    console.log('token refresh!', token)
  })

  messaging.onMessage(payload => {
    console.log('received message!', payload)
    /*
    Notify.create({
      message: payload.notification.title + ' // ' + payload.notification.body,
      type: 'positive',
      position: 'top',
      actions: [
        {
          label: 'View',
          noDismiss: true, // optional, v0.15.11+
          handler: () => {
            router.push(payload.notification.click_action.replace(/^.*\/#/, ''))
          },
        },
      ],
    })
    */
  })

  return messaging
}

/*
 * When we disable push notifications we need to remove the service workers.
 * If we remove them immediately, then re-enable push notifications then
 * firebase messsaging library gets upset. So we just store whether we want them removed
 * only do it when the page actually closes.
 */

let shouldRemoveServiceWorkers = false
export async function removeServiceWorkersOnUnload (value) {
  shouldRemoveServiceWorkers = value
}

async function removeServiceWorkers () {
  for (const worker of await getServiceWorkers()) {
    worker.unregister()
  }
}

window.onbeforeunload = () => {
  // Do not return anything from this function or it triggers a browser dialog
  if (shouldRemoveServiceWorkers) removeServiceWorkers()
}
