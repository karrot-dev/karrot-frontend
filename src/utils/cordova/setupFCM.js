import store from '@/base/store'
import router from '@/base/router'

document.addEventListener('deviceready', onDeviceReady, false)

const devicereadyTimeout = setTimeout(() => {
  console.error('deviceready not fired within 5 seconds, is cordova.js loaded? FCM will not work otherwise.')
}, 5000)

function onDeviceReady () {
  clearTimeout(devicereadyTimeout)
  const { FCMPlugin } = window
  if (FCMPlugin) {
    FCMPlugin.onTokenRefresh(receiveFCMToken)
    FCMPlugin.getToken(receiveFCMToken)
    FCMPlugin.onNotification(receiveNotification)
  }
  else {
    console.error('window.FCMPlugin is not available, push notifications will not work')
  }
}

function receiveNotification (data) {
  if (!data.wasTapped) return
  // Notification was received on device tray and tapped by the user
  const route = data.karrot_route
  if (route) {
    router.push(route)
  }
}

function receiveFCMToken (token) {
  store.dispatch('fcm/updateToken', token)
}
