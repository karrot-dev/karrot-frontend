import { Notify } from 'quasar'
// import router from '@/router'

import subscriptionsAPI from '@/services/api/subscriptions'

import { getMessaging, getServiceWorkers } from '@/services/firebase'

export function isSupported () {
  return (navigator.cookieEnabled &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    'fetch' in window &&
    ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification') &&
    PushSubscription.prototype.hasOwnProperty('getKey'))
}

function saveIntention (enabled) {
  window.localStorage.setItem('push', JSON.stringify(enabled))
}

function getIntention () {
  const value = window.localStorage.getItem('push')
  if (value !== null) return JSON.parse(value)
}

function clearIntention () {
  window.localStorage.removeItem('push')
}

async function disable () {
  const workers = await getServiceWorkers()
  console.log('disabling! have', workers.length, 'workers')
  if (workers.length === 0) return
  const messaging = await getMessaging()
  let token = await messaging.getToken()
  if (!token) return
  const subscription = (await subscriptionsAPI.list()).find(subscription => subscription.token === token)
  if (subscription) await subscriptionsAPI.delete(subscription.id)
  for (const worker of workers) {
    worker.unregister()
  }
}

async function enable () {
  const messaging = await getMessaging()
  let token = await messaging.getToken()
  if (!token) {
    try {
      await messaging.requestPermission()
    }
    catch (err) {
      if (err.code === 'messaging/notifications-blocked' || err.code === 'messaging/permission-blocked') {
        console.log('blocked!', err.code)
        saveIntention(false)
      }
      else if (err.code === 'messaging-permission-default') {
        // they said "not now" but didn't outright deny it...
        // don't ask again for this session, but can enable the next time
        clearIntention()
      }
      else {
        console.log('some other error whilst request permission', err)
      }
      return
    }
    token = await messaging.getToken()
  }
  const subscription = (await subscriptionsAPI.list()).find(subscription => subscription.token === token)
  console.log('got a token!', token)
  if (subscription) {
    console.log('already got a subscription for it!', subscription)
    /*
    console.log('removing it')
    try {
      await messaging.deleteToken(subscription.token)
    }
    catch (err) {
      console.warn('error deleting token', err)
    }
    await subscriptionsAPI.delete(subscription.id)
    console.log('deleted existing one!')
    */
  }
  if (!subscription) {
    const res = await subscriptionsAPI.create({token, platform: 'web'})
    console.log('foo', res)
  }
}

function ask () {
  Notify.create({
    message: 'Can we send you push notifications?',
    type: 'info',
    timeout: 0,
    position: 'top',
    actions: [
      {
        label: 'That would be lovely!',
        handler () {
          saveIntention(true)
          enable()
        },
      },
      {
        label: 'No thanks!',
        handler () {
          saveIntention(false)
          disable()
        },
      },
    ],
  })
}

export default {
  async initialize () {
    const intention = getIntention()
    console.log('intention is', intention)
    if (intention === true) {
      await enable()
    }
    else if (intention === false) {
      // do nothing they said they don't want us to do anything
      disable()
    }
    else {
      ask()
    }
  },
}

window.turnOffPush = () => {
  saveIntention(false)
  disable()
}

window.clearPush = () => {
  clearIntention()
}
