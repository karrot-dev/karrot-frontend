import { getFirebaseConfig } from '@/subscriptions/firebase.config'

export function isSupported () {
  return Boolean(navigator.serviceWorker)
}

export async function getServiceWorkerRegistration () {
  // See also https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready
  return await navigator.serviceWorker.ready
}

let messaging
export async function initializeMessaging () {
  // In a separate async import, so we only load firebase if we actually need it
  const { initializeApp, getMessaging, onMessage, getToken, deleteToken } = await import('./firebase.lib')

  if (!messaging) {
    const firebaseConfig = await getFirebaseConfig()
    const app = initializeApp(firebaseConfig)
    messaging = await getMessaging(app)

    onMessage(messaging, m => {
      console.log('onMessage', m)
    })
  }

  return {
    getToken (options) {
      return getToken(messaging, options)
    },
    deleteToken (options) {
      return deleteToken(messaging, options)
    },
  }
}
