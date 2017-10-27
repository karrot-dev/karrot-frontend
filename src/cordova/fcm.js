/*

  This is for handling fcm push notification tokens

*/

import axios from '@/services/axios'

document.addEventListener('deviceready', onDeviceReady, false)

function onDeviceReady () {
  const { FCMPlugin } = window
  if (FCMPlugin) {
    FCMPlugin.onTokenRefresh(receiveToken)
    FCMPlugin.getToken(receiveToken)
  }
  else {
    console.error('window.FCMPlugin is not available, push notifications will not work')
  }
}

let token
export async function receiveToken (val) {
  if (val && val !== token) {
    token = val
    const data = (await axios.post('/api/subscriptions/push', { token, platform: 'android' })).data
    console.log('saved token!', data)
  }
}
