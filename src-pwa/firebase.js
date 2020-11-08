import 'firebase/messaging'
import firebase from 'firebase/app'
import firebaseConfig from '@/subscriptions/firebase.config'

const app = firebase.initializeApp(firebaseConfig)

export async function init () {
  // Actually start showing background notifications
  const messaging = firebase.messaging(app)

  messaging.onBackgroundMessage(payload => {
    // not actually used, but without it here firefox does not receive messages...
    console.log('onBackgroundMessage', payload)
  })
}
