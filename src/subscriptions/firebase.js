import firebaseConfig from './firebase.config'

export function isSupported () {
  return Boolean(navigator.serviceWorker)
}

export async function getServiceWorkerRegistration () {
  // See also https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready
  return await navigator.serviceWorker.ready
}

let messaging
export async function initializeMessaging () {
  if (messaging) return messaging

  const { initializeApp, messaging: messagingFactory } = await import('./firebase.lib')

  const app = initializeApp(firebaseConfig)
  messaging = await messagingFactory(app)

  messaging.onMessage(m => {
    console.log('onMessage', m)
  })

  return messaging
}
