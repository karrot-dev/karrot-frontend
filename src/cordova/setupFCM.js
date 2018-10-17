import store from '@/store'

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
  }
  else {
    console.error('window.FCMPlugin is not available, push notifications will not work')
  }
}

function receiveFCMToken (token) {
  store.dispatch('fcm/updateToken', token)
}
