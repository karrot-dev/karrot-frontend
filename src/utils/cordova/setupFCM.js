import datastore from '@/store'
import router from '@/router'

document.addEventListener('deviceready', onDeviceReady, false)

const devicereadyTimeout = setTimeout(() => {
  console.error('deviceready not fired within 5 seconds, is cordova.js loaded? FCM will not work otherwise.')
}, 5000)

async function onDeviceReady () {
  clearTimeout(devicereadyTimeout)
  const { FCM } = window
  if (FCM) {
    receiveFCMToken(await FCM.getToken())
    FCM.onTokenRefresh(receiveFCMToken)
    FCM.onNotification(receiveNotification)
  }
  else {
    console.error('window.FCM is not available, push notifications will not work')
  }
}

function receiveNotification (data) {
  if (!data.wasTapped) return
  // Notification was received on device tray and tapped by the user
  const path = data.karrot_route
  if (path) {
    const pendingRoute = datastore.state.routeMeta.next
    if (pendingRoute && pendingRoute.path === path) return
    router.push(path).catch(() => {})
  }
}

function receiveFCMToken (token) {
  datastore.commit('fcm/setToken', token)
}
