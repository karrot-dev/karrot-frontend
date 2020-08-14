import datastore from '@/base/datastore'
import router from '@/base/router'

document.addEventListener('deviceready', onDeviceReady, false)

const devicereadyTimeout = setTimeout(() => {
  console.error('deviceready not fired within 5 seconds, is cordova.js loaded? FCM will not work otherwise.')
}, 5000)

function onDeviceReady () {
  clearTimeout(devicereadyTimeout)
  const { FCMPlugin } = window
  if (FCMPlugin) {
    receiveFCMToken(await FCMPlugin.getToken())
    FCMPlugin.onTokenRefresh(receiveFCMToken)
    FCMPlugin.onNotification(receiveNotification)
  }
  else {
    console.error('window.FCMPlugin is not available, push notifications will not work')
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
