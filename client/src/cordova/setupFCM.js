import store from '@/store'

document.addEventListener('deviceready', onDeviceReady, false)

function onDeviceReady () {
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
