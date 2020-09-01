import 'firebase/messaging'
import { initializeApp, messaging as messagingFactory } from 'firebase/app'
import firebaseConfig from '@/subscriptions/firebase.config'

const app = initializeApp(firebaseConfig)

export async function init () {
  // Actually start showing background notifications
  const messaging = messagingFactory(app)

  messaging.onBackgroundMessage(payload => {
    // not actually used, but without it here firefox does not receive messages...
    console.log('onBackgroundMessage', payload)
  })
}
