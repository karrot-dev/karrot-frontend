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
