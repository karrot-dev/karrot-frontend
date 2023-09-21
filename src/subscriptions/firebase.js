import { getFirebaseConfig } from '@/subscriptions/firebase.config'

export function isSupported () {
  return Boolean(navigator.serviceWorker) && ('PushManager' in window)
}

export async function getServiceWorkerRegistration () {
  // See also https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready
  //
  // It returns a Promise that will never reject, and which waits indefinitely until the
  // ServiceWorkerRegistration associated with the current page has an active worker
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

    const registration = await getServiceWorkerRegistration()

    onMessage(messaging, message => {
      console.log('onMessage', message)
      if (registration && registration.showNotification) {
        // Show push messages when in the foreground
        const { title, body } = message.notification || {}
        if (title) {
          const options = {}
          if (body) options.body = body
          registration.showNotification(title, options)
        }
      }
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
